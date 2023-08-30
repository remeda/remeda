export type FunctionsData = ReadonlyArray<FunctionData>;

export interface FunctionData {
  readonly name: string;
  readonly description: string;
  readonly methods: ReadonlyArray<SignatureData>;
  readonly category: string;
}

export interface SignatureData {
  readonly tag: 'Data First' | 'Data Last';
  readonly signature: string;
  readonly indexed: boolean;
  readonly pipeable: boolean;
  readonly strict: boolean;
  readonly example: string;
  readonly args: ReadonlyArray<ParamData>;
  readonly returns: ParamData;
}

export interface ParamData {
  readonly name: string;
  readonly description: string;
}
