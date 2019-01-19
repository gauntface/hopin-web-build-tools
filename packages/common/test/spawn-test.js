const test = require('ava');
const sinon = require('sinon');
const childProcess = require('child_process');

const {spawn} = require('../src');

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox();
});

test.afterEach.always((t) => {
  t.context.sandbox.restore();
});

test.serial('should handle stdour and stderr logs', async (t) => {
    const eventMap = {};

    const setupPromise = new Promise((resolve) => {
      t.context.sandbox.stub(childProcess, 'spawn').callsFake(() => {
        return {
          on: (name, cb) => {
            if (!eventMap[name]) {
                eventMap[name] = [];
            }
            eventMap[name].push(cb);
            if (name == 'close') {
              // This is a hack to start test after all listeners are set
              resolve();
            }
          },
          stdout: {
            on: (name, cb) => {
              const newName = `stdout.${name}`
              if (!eventMap[newName]) {
                eventMap[newName] = [];
              }
              eventMap[newName].push(cb);
            },
          },
          stderr: {
            on: (name, cb) => {
              const newName = `stderr.${name}`
              if (!eventMap[newName]) {
                eventMap[newName] = [];
              }
              eventMap[newName].push(cb);
            },
          },
        };
      });
    })

    const spawnPromise = spawn(console, 'echo "hello, world"')
    await setupPromise

    eventMap['stdout.data'][0]('testing stdout');
    eventMap['stderr.data'][0]('testing stderr');
    eventMap['close'][0](0);

    const result = await spawnPromise;
    t.deepEqual(result, {
      stdout: 'testing stdout',
      stderr: 'testing stderr',
      code: 0,
    });
});

test.serial('should reject on a non-zero exit code', async (t) => {
  const eventMap = {};

  const setupPromise = new Promise((resolve) => {
    t.context.sandbox.stub(childProcess, 'spawn').callsFake(() => {
      return {
        on: (name, cb) => {
          if (!eventMap[name]) {
              eventMap[name] = [];
          }
          eventMap[name].push(cb);
          if (name == 'close') {
            // This is a hack to start test after all listeners are set
            resolve();
          }
        },
        stdout: {
          on: (name, cb) => {
            const newName = `stdout.${name}`
            if (!eventMap[newName]) {
              eventMap[newName] = [];
            }
            eventMap[newName].push(cb);
          },
        },
        stderr: {
          on: (name, cb) => {
            const newName = `stderr.${name}`
            if (!eventMap[newName]) {
              eventMap[newName] = [];
            }
            eventMap[newName].push(cb);
          },
        },
      };
    });
  })

  const spawnPromise = spawn(console, 'echo "hello, world"')
  await setupPromise

  eventMap['close'][0](1);

  try {
    await spawnPromise;
    t.fail(`spawn promise did not reject`);
  } catch (err) {
    t.deepEqual(err.message, `command exited with bad code 1`);
  }
});

test.serial('should reject on error event', async (t) => {
  const eventMap = {};

  const setupPromise = new Promise((resolve) => {
    t.context.sandbox.stub(childProcess, 'spawn').callsFake(() => {
      return {
        on: (name, cb) => {
          if (!eventMap[name]) {
              eventMap[name] = [];
          }
          eventMap[name].push(cb);
          if (name == 'close') {
            // This is a hack to start test after all listeners are set
            resolve();
          }
        },
        stdout: {
          on: (name, cb) => {
            const newName = `stdout.${name}`
            if (!eventMap[newName]) {
              eventMap[newName] = [];
            }
            eventMap[newName].push(cb);
          },
        },
        stderr: {
          on: (name, cb) => {
            const newName = `stderr.${name}`
            if (!eventMap[newName]) {
              eventMap[newName] = [];
            }
            eventMap[newName].push(cb);
          },
        },
      };
    });
  })

  const spawnPromise = spawn(console, 'echo "hello, world"')
  await setupPromise

  eventMap['error'][0](new Error('Injected error'));

  try {
    await spawnPromise;
    t.fail(`spawn promise did not reject`);
  } catch (err) {
    t.deepEqual(err.message, `Injected error`);
  }
});