module.exports = {
  default: {
    requireModule: [
      'ts-node/register/files',
      'tsconfig-paths/register'
    ],
    require: [
      'features/support/**/!(*.d).ts',
      'features/step_definitions/**/!(*.d).ts'
    ],
    publishQuiet: true,
    format: ['progress', 'summary'],
    paths: ['features/*.feature'],
    tags: 'not @manual'
  },
  smoke: {
    requireModule: [
      'ts-node/register/files',
      'tsconfig-paths/register'
    ],
    require: [
      'features/support/**/!(*.d).ts',
      'features/step_definitions/**/!(*.d).ts'
    ],
    publishQuiet: true,
    format: ['progress', 'summary'],
    paths: ['features/*.feature'],
    tags: '@smoke and not @manual'
  }
};
