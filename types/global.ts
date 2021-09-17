export {};

declare global {
    namespace NodeJS {
        interface Global {
            TEST_MODE: boolean
        }
    }
}