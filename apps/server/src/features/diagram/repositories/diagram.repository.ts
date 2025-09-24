import { Injectable, Logger } from "@nestjs/common";
import { Neo4jService } from "src/core/neo4j/neo4j.service";
import { DiagramModel, DiagramModelType } from "../models/diagram.model";
import { NodeModel, NodeModelType } from "../models/node.model";
import { EdgeModel, EdgeModelType } from "../models/edge.model";
import { Diagram } from "../entities/diagram.entity";
import { Node } from "../entities/node.entity";
import { Edge } from "../entities/edge.entity";
import { CreateDiagramDto } from "@repo/shared-schemas";
import { EdgeInterface, NodeInterface } from "../interfaces/diagram.interface";

@Injectable()
export class DiagramRepository {
  private diagramModel: DiagramModelType;
  private nodeModel: NodeModelType;
  private edgeModel: EdgeModelType;
  private logger = new Logger(DiagramRepository.name);

  constructor(private readonly neo4jService: Neo4jService) {
    this.diagramModel = DiagramModel(this.neo4jService.getNeogma());
    this.nodeModel = NodeModel(this.neo4jService.getNeogma());
    this.edgeModel = EdgeModel(this.neo4jService.getNeogma());
  }

  /**
   * Creates a new diagram with the given data
   */
  async createDiagram(createDto: CreateDiagramDto): Promise<Diagram> {
    try {
      const diagram = await this.diagramModel.createOne({
        name: createDto.name,
        type: createDto.type,
        project: {
          where: [{ params: { id: createDto.projectId } }],
        },
      });

      return diagram;
    } catch (error) {
      this.logger.error(`Failed to create diagram: ${error.message}`, error.stack);
      throw new Error(`Failed to create diagram: ${error.message}`);
    }
  }

  /**
   * Retrieves a diagram by its ID including all elements (nodes and edges)
   */
  async getDiagramById(id: string): Promise<Diagram | null> {
    try {
      const diagram = await this.diagramModel.findOne({
        where: { id },
      });

      if (!diagram) return null;

      const elements = await this.fetchDiagramElements(id);
      return {
        ...diagram,
        ...elements,
      };
    } catch (error) {
      this.logger.error(`Failed to get diagram by ID: ${error.message}`, error.stack);
      throw new Error(`Failed to get diagram by ID: ${error.message}`);
    }
  }

  /**
   * Updates a diagram including its nodes and edges
   */
  async updateDiagram(
    id: string,
    name?: string,
    nodes?: NodeInterface[],
    edges?: EdgeInterface[],
  ): Promise<Diagram> {
    if (name) {
      await this.diagramModel.updateOneOrThrow({ name }, { where: { id } });
    }

    // Handle nodes
    if (nodes && nodes.length > 0) {
      const currentNodes: Node[] = await this.fetchNodesByDiagramId(id);
      const currentNodeMap = new Map(currentNodes.map((node) => [node.id, node]));

      const nodesToCreate = nodes.filter((node) => !node.id || !currentNodeMap.has(node.id));
      const nodesToUpdate = nodes.filter((node) => node.id && currentNodeMap.has(node.id));
      const nodeIdsToKeep = new Set(nodes.map((node) => node.id).filter(Boolean));
      const nodesToDelete = currentNodes.filter((node) => !nodeIdsToKeep.has(node.id));

      // Delete nodes
      if (nodesToDelete.length > 0) {
        this.logger.log(`Deleting ${nodesToDelete.length} nodes from diagram ${id}`);
        for (const node of nodesToDelete) {
          await this.nodeModel.delete({ where: { id: node.id }, detach: true });
        }
      }

      // Update nodes
      if (nodesToUpdate.length > 0) {
        this.logger.log(`Updating ${nodesToUpdate.length} nodes in diagram ${id}`);
        for (const node of nodesToUpdate) {
          await this.updateNode(node);
        }
      }

      // Create new nodes
      if (nodesToCreate.length > 0) {
        this.logger.log(`Creating ${nodesToCreate.length} new nodes in diagram ${id}`);
        for (const node of nodesToCreate) {
          await this.createNode(node, id);
        }
      }
    } else {
      const currentNodes: Node[] = await this.fetchNodesByDiagramId(id);
      for (const node of currentNodes) {
        await this.nodeModel.delete({ where: { id: node.id }, detach: true });
      }
    }

    // Handle edges
    if (edges && edges.length > 0) {
      const currentEdges: Edge[] = await this.fetchEdgesByDiagramId(id);
      const currentEdgeMap = new Map(currentEdges.map((edge) => [edge.id, edge]));

      const edgesToCreate = edges.filter((edge) => !edge.id || !currentEdgeMap.has(edge.id));
      const edgesToUpdate = edges.filter((edge) => edge.id && currentEdgeMap.has(edge.id));
      const edgeIdsToKeep = new Set(edges.map((edge) => edge.id).filter(Boolean));
      const edgesToDelete = currentEdges.filter((edge) => !edgeIdsToKeep.has(edge.id));

      // Delete edges
      if (edgesToDelete.length > 0) {
        this.logger.log(`Deleting ${edgesToDelete.length} edges from diagram ${id}`);
        for (const edge of edgesToDelete) {
          await this.edgeModel.delete({ where: { id: edge.id }, detach: true });
        }
      }

      // Update edges
      if (edgesToUpdate.length > 0) {
        this.logger.log(`Updating ${edgesToUpdate.length} edges in diagram ${id}`);
        for (const edge of edgesToUpdate) {
          await this.updateEdge(edge);
        }
      }

      // Create new edges
      if (edgesToCreate.length > 0) {
        this.logger.log(`Creating ${edgesToCreate.length} new edges in diagram ${id}`);
        for (const edge of edgesToCreate) {
          await this.createEdge(edge, id);
        }
      }
    } else {
      const currentEdges: Edge[] = await this.fetchEdgesByDiagramId(id);
      for (const edge of currentEdges) {
        await this.edgeModel.delete({ where: { id: edge.id }, detach: true });
      }
    }

    // Fetch the updated diagram
    const updatedDiagram = await this.getDiagramById(id);
    if (!updatedDiagram) {
      throw new Error(`Diagram with ID ${id} not found after update`);
    }

    return updatedDiagram;
  }

  /**
   * Retrieves all diagrams for a project, optionally filtered by type
   */
  async getDiagramsByProject(projectId: string, type?: string): Promise<Diagram[]> {
    try {
      const whereClause: Record<string, any> = {};
      if (type) {
        whereClause.type = type;
      }

      const diagrams: Diagram[] = await this.diagramModel.findByRelatedEntity({
        whereRelated: { id: projectId },
        relationshipAlias: "project",
        where: whereClause,
      });

      return diagrams;
    } catch (error) {
      this.logger.error(`Failed to get diagrams by project: ${error.message}`, error.stack);
      throw new Error(`Failed to get diagrams by project: ${error.message}`);
    }
  }

  /**
   * Deletes a diagram and all its elements (nodes and edges)
   */
  async deleteDiagram(id: string): Promise<boolean> {
    try {
      // Delete associated nodes
      const nodes = await this.fetchNodesByDiagramId(id);
      for (const node of nodes) {
        await this.nodeModel.delete({ where: { id: node.id }, detach: true });
      }

      // Delete associated edges
      const edges = await this.fetchEdgesByDiagramId(id);
      for (const edge of edges) {
        await this.edgeModel.delete({ where: { id: edge.id }, detach: true });
      }

      // Delete the diagram itself
      const result = await this.diagramModel.delete({ where: { id }, detach: true });
      return result > 0;
    } catch (error) {
      this.logger.error(`Failed to delete diagram: ${error.message}`, error.stack);
      throw new Error(`Failed to delete diagram: ${error.message}`);
    }
  }

  /**
   * Creates a new node for a diagram
   */
  async createNode(nodeData: NodeInterface, diagramId: string): Promise<Node> {
    try {
      // Validate required fields
      this.validateNodeData(nodeData);

      // Create the node
      const node = await this.nodeModel.createOne({
        ...nodeData,
        diagram: {
          where: [{ params: { id: diagramId } }],
        },
      });

      return node;
    } catch (error) {
      this.logger.error(`Failed to create node: ${error.message}`, error.stack);
      throw new Error(`Failed to create node: ${error.message}`);
    }
  }

  /**
   * Updates an existing node
   */
  async updateNode(updateDto: NodeInterface): Promise<Node | null> {
    try {
      if (!updateDto.id) return null;

      const result = await this.nodeModel.updateOneOrThrow(updateDto, {
        where: { id: updateDto.id },
        return: true,
      });

      return result || null;
    } catch (error) {
      throw new Error(`Failed to update node: ${error.message}`);
    }
  }

  /**
   * Creates a new edge for a diagram
   */
  async createEdge(edgeData: EdgeInterface, diagramId: string): Promise<Edge> {
    try {
      // Validate required fields
      this.validateEdgeData(edgeData);

      // Create the edge
      const edge = await this.edgeModel.createOne({
        ...edgeData,
        diagram: {
          where: [{ params: { id: diagramId } }],
        },
      });

      return edge;
    } catch (error) {
      this.logger.error(`Failed to create edge: ${error.message}`, error.stack);
      throw new Error(`Failed to create edge: ${error.message}`);
    }
  }

  /**
   * Updates an existing edge
   */
  async updateEdge(updateDto: EdgeInterface): Promise<Edge | null> {
    try {
      if (!updateDto.id) return null;

      const result = await this.edgeModel.updateOneOrThrow(updateDto, {
        where: { id: updateDto.id },
        return: true,
      });

      return result || null;
    } catch (error) {
      this.logger.error(`Failed to update edge: ${error.message}`, error.stack);
      throw new Error(`Failed to update edge: ${error.message}`);
    }
  }

  /**
   * Fetches all nodes for a diagram
   */
  private async fetchNodesByDiagramId(diagramId: string): Promise<Node[]> {
    const nodes: Node[] = await this.nodeModel.findByRelatedEntity({
      whereRelated: { id: diagramId },
      relationshipAlias: "diagram",
    });
    return nodes;
  }

  /**
   * Fetches all edges for a diagram
   */
  private async fetchEdgesByDiagramId(diagramId: string): Promise<Edge[]> {
    const edges: Edge[] = await this.edgeModel.findByRelatedEntity({
      whereRelated: { id: diagramId },
      relationshipAlias: "diagram",
    });
    return edges;
  }

  /**
   * Fetches all elements (nodes and edges) for a diagram
   */
  private async fetchDiagramElements(diagramId: string): Promise<{ nodes: Node[]; edges: Edge[] }> {
    try {
      const nodes = await this.fetchNodesByDiagramId(diagramId);
      const edges = await this.fetchEdgesByDiagramId(diagramId);

      return {
        nodes: nodes,
        edges: edges,
      };
    } catch (error) {
      this.logger.error(`Failed to get diagram elements: ${error.message}`, error.stack);
      throw new Error(`Failed to get diagram elements: ${error.message}`);
    }
  }

  /**
   * Validates node data for required fields
   */
  private validateNodeData(nodeData: any): void {
    if (!nodeData.type) {
      throw new Error("Node type is required");
    }

    if (nodeData.x === undefined || nodeData.y === undefined) {
      throw new Error("Node position (x, y) is required");
    }

    if (!nodeData.width || !nodeData.height) {
      throw new Error("Node dimensions (width, height) are required");
    }
  }

  /**
   * Validates edge data for required fields
   */
  private validateEdgeData(edgeData: any): void {
    if (!edgeData.type) {
      throw new Error("Edge type is required");
    }

    if (!edgeData.source || !edgeData.target) {
      throw new Error("Edge source and target are required");
    }

    if (!edgeData.sourceHandle || !edgeData.targetHandle) {
      throw new Error("Edge source and target handles are required");
    }
  }
}
