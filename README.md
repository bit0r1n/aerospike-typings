# aerospike-typings
Since typings in [original repo](https://github.com/aerospike/aerospike-client-nodejs/blob/master/typings/index.d.ts) are kinda messy, like why `export const Client: typeof import("client");`, it results in `object` type?? And there also a lot of any =((

Actual for version 5.12.0

## Installation
1. Install package `npm install https://github.com/bit0r1n/aerospike-typings -D`
2. Add path to typings in tsconfig file `compilerOptions["paths"]["aerospike"] = [ "node_modules/aerospike-typings" ]`
3. Enjoy !!

If you have noticed any problem/missing typing, freely create an issue/PR
