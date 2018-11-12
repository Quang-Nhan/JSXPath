
enum CORE_NUMBER_FUNCTIONS {
  'number(' = '#number(',
  'abs(' = '#abs(',
  'ceiling(' = '#ceiling(',
  'floor(' = '#floor(',
  'round(' = '#round('
};

enum CORE_STRING_FUNCTIONS {
  'string(' = '#string(',
  'string-join(' = '#stringJoin(',
  'concat(' = '#concat('
};

enum CORE_BOOLEAN_FUNCTIONS {
  'boolean(' = '#boolean(',
  'not(' = '#not(',
  'true(' = '#true(',
  'false(' = '#false('
};

enum CORE_TIME_FUNCITON {

}

enum CORE_CONTEXT_FUNCTION {
  'position(' = '#position(',
  'last(' = '#last(',
  'first(' = '#first('
}

enum CORE_SEQUENCES_FUNCTION {

}


export const FUNCTION_ENUMS = Object.assign({},
  CORE_NUMBER_FUNCTIONS,
  CORE_STRING_FUNCTIONS,
  CORE_BOOLEAN_FUNCTIONS,
  CORE_TIME_FUNCITON,
  CORE_CONTEXT_FUNCTION,
  CORE_SEQUENCES_FUNCTION
);