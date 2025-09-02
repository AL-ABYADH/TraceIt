import { SetMetadata } from "@nestjs/common";

export const WS_IS_PUBLIC_KEY = "wsIsPublic";
export const WebSocketPublic = () => SetMetadata(WS_IS_PUBLIC_KEY, true);
