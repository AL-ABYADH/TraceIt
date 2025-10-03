type Merge<T> = { [P in keyof T]: T[P] };

export type MakeOptional<T, K extends keyof T> = Merge<Omit<T, K> & Partial<Pick<T, K>>>;
