import { rm } from "fs/promises"
import { join } from "path"

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'))
  } catch (err) {
    // Silently catch error - if file doesn't exist, that's fine
    // We just want to ensure a clean state before each test
  }
})