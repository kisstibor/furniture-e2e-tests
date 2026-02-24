module.exports = {
  default: {
    requireModule: [
      'ts-node/register/transpile-only',
      'tsconfig-paths/register'
    ],
    require: [
      'features/support/**/*.ts',
      'features/step_definitions/**/*.ts'
    ],
    publishQuiet: true,
    format: ['progress', 'summary'],
    paths: ['features/*.feature'],
    tags: 'not @manual'
  },
  smoke: {
    requireModule: [
      'ts-node/register/transpile-only',
      'tsconfig-paths/register'
    ],
    require: [
      'features/support/**/*.ts',
      'features/step_definitions/**/*.ts'
    ],
    publishQuiet: true,
    format: ['progress', 'summary'],
    paths: ['features/*.feature'],
    tags: '@smoke and not @manual'
  }
};
