# aerospike-typings
Since typings in [original repo](https://github.com/aerospike/aerospike-client-nodejs/blob/master/typings/index.d.ts) are kinda messy, like why `export const Client: typeof import("client");`, it results in `object` type?? And there also a lot of any =((

Actual for version 5.9.0

## Workaround to use it
1. Add this repo as submodule
2. Add path to submodule in tsconfig, like `compilerOptions.paths["*"] = ["submodules/aerospike-typings/*"]`
3. Enjoy .

If you have noticied any problem/missing typing, freely create an issue.
