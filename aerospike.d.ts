import { EventEmitter, Stream } from "stream";

declare module "aerospike" {
    // type PartialAerospikeRecordValue = null | undefined | boolean | string | number | Double | BigInt | Buffer | GeoJSON;
    type AerospikeRecordValue = any;
    type AerospikeMapKey = any[] | string | number | Double;

    type AerospikeBins = {
        [key: string]: AerospikeRecordValue
    };

    // Commands

    class Command {
        readonly client: Client;
        private args: any[];
        protected callback(...args: any[]): any;
        readonly captureStackTraces: boolean;
        public key?: IKey;
        public ensureConnected: boolean;
        constructor(client: Client, args: any[], callback?: AddonCallback);
        private captureStackTrace(): void;
        private connected(): boolean;
        private convertError(): AerospikeError;
        protected convertResult(...args): any;
        protected convertResponse(err, ...args): [AerospikeError | null, any];
        private execute(): Promise<any> | void;
        private executeWithCallback(callback: AddonCallback): void;
        private executeAndReturnPromise(): Promise<any>;
        private expectsPromise(): boolean;
        private asCommand(): string;
        private process(cb: AddonCallback): void;
        private sendError(message: string): void;
    }

    interface IBatchResult<T extends AerospikeBins> {
        status: Status;
        record: AerospikeRecord<T>;
    }

    class BatchCommand extends Command {
        protected convertResult<T extends AerospikeBins = AerospikeBins>(results: AerospikeRecord<T>[]): IBatchResult<T>[];
    }

    class ConnectCommandBase extends Command {
        constructor(client: Client, callback: AddonCallback);
    }

    class ExistsCommandBase extends Command {
        protected convertResponse(error: AerospikeError): [AerospikeError | null, boolean];
    }

    class ReadRecordCommand extends Command {
        constructor(client: Client, key: IKey, args: any[]);
        public convertResult<T extends AerospikeBins = AerospikeBins>(bins: AerospikeBins, metadata: IRecordMetadata): AerospikeRecord<T>;
    }

    class StreamCommand extends Command {
        public stream: RecordStream;
        constructor(stream: RecordStream, args: any[]);
        protected callback<T extends AerospikeBins = AerospikeBins>(error: Error, record: AerospikeRecord<T>): boolean;
        protected convertResult<T extends AerospikeBins = AerospikeBins>(bins: AerospikeBins, meta: IRecordMetadata, asKey: IKey): AerospikeRecord<T> | { state: IRecordMetadata };
    }

    class WriteRecordCommand extends Command {
        constructor(client: Client, key: IKey, args: any[], callback: AddOperation);
        protected convertResult(): IKey;
    }

    class QueryBackgroundBaseCommand extends Command {
        public queryID: number;
        public queryObj: IQueryOptions;
        constructor(client: Client, ns: string, set: string, queryObj: IQueryOptions, policy: IQueryPolicyProps, queryID: number, callback: AddonCallback);
        public convertResult(): Job;
    }

    class ApplyCommand extends Command { }

    class BatchExistsCommand extends BatchCommand { }

    class BatchGetCommand extends BatchCommand { }

    class BatchReadCommand extends BatchCommand { }

    class BatchWriteCommand extends BatchCommand { }

    class BatchApplyCommand extends BatchCommand { }

    class BatchRemoveCommand extends BatchCommand { }

    class BatchSelectCommand extends BatchCommand { }

    class ChangePasswordCommand extends Command { }

    class ConnectCommand extends ConnectCommandBase { }

    class ExistsCommand extends ExistsCommandBase { }

    class GetCommand extends ReadRecordCommand { }

    class IndexCreateCommand extends Command { }

    class IndexRemoveCommand extends Command { }

    class InfoAnyCommand extends Command { }

    class InfoForeachCommand extends Command { }

    class InfoHostCommand extends Command { }

    class InfoNodeCommand extends Command { }

    class JobInfoCommand extends Command { }

    class OperateCommand extends ReadRecordCommand { }

    class PrivilegeGrantCommand extends Command { }

    class PrivilegeRevokeCommand extends Command { }

    class PutCommand extends WriteRecordCommand { }

    class QueryCommand extends StreamCommand { }

    class QueryPagesCommand extends StreamCommand { }

    class QueryApplyCommand extends Command { }

    class QueryBackgroundCommand extends QueryBackgroundBaseCommand { }

    class QueryOperateCommand extends QueryBackgroundBaseCommand { }

    class QueryForeachCommand extends StreamCommand { }

    class QueryRoleCommand extends Command { }

    class QueryRolesCommand extends Command { }

    class QueryUserCommand extends Command { }

    class QueryUsersCommand extends Command { }

    class RemoveCommand extends WriteRecordCommand { }

    class RoleCreateCommand extends Command { }

    class RoleDropCommand extends Command { }

    class RoleGrantCommand extends Command { }

    class RoleRevokeCommand extends Command { }

    class RoleSetWhitelistCommand extends Command { }

    class RoleSetQuotasCommand extends Command { }

    class ScanCommand extends StreamCommand { }

    class ScanPagesCommand extends StreamCommand { }

    class ScanBackgroundCommand extends QueryBackgroundBaseCommand { }

    class ScanOperateCommand extends QueryBackgroundBaseCommand { }

    class SelectCommand extends ReadRecordCommand { }

    class TruncateCommand extends Command { }

    class UdfRegisterCommand extends Command { }

    class UdfRemoveCommand extends Command { }

    class UserCreateCommand extends Command { }

    class UserDropCommand extends Command { }

    // C++ bindings
    enum ExpOpcodes {
        CMP_EQ = 1,
        CMP_NE,
        CMP_GT,
        CMP_GE,
        CMP_LT,
        CMP_LE,

        CMP_REGEX,
        CMP_GEO,

        AND = 16,
        OR,
        NOT,
        EXCLUSIVE,

        DIGEST_MODULO,
        DEVICE_SIZE,
        LAST_UPDATE,
        SINCE_UPDATE,
        VOID_TIME,
        TTL,
        SET_NAME,
        KEY_EXIST,
        IS_TOMBSTONE,
        MEMORY_SIZE,

        KEY = 80,
        BIN,
        BIN_TYPE,

        QUOTE = 126,
        CALL,

        AS_VAL,
        VAL_GEO,
        VAL_PK,
        VAL_INT,
        VAL_UINT,
        VAL_FLOAT,
        VAL_BOOL,
        VAL_STR,
        VAL_BYTES,
        VAL_RAWSTR,
        VAL_RTYPE,

        CALL_VOP_START,
        CDT_LIST_CRMOD,
        CDT_LIST_MOD,
        CDT_MAP_CRMOD,
        CDT_MAP_CR,
        CDT_MAP_MOD,

        END_OF_VA_ARGS,

        ADD = 20,
        SUB,
        MUL,
        DIV,
        POW,
        LOG,
        MOD,
        ABS,
        FLOOR,
        CEIL,
        TO_INT,
        TO_FLOAT,
        INT_AND,
        INT_OR,
        INT_XOR,
        INT_NOT,
        INT_LSHIFT,
        INT_RSHIFT,
        INT_ARSHIFT,
        INT_COUNT,
        INT_LSCAN,
        INT_RSCAN,
        MIN = 50,
        MAX,

        COND = 123,
        VAR,
        LET
    }

    enum ExpSystemTypes {
        CALL_CDT,
        CALL_BITS,
        CALL_HLL,

        FLAG_MODIFY_LOCAL = 64
    }

    enum ExpTypes {
        NIL,
        // BOOL - no boolean type in src/main/enums/exp_enum.cc#L127
        INT = 2,
        STR,
        LIST,
        MAP,
        BLOB,
        FLOAT,
        GEOJSON,
        HLL,

        AUTO,
        ERROR
    }

    interface IExpOpcodesValues {
        ops: ExpOpcodes,
        sys: ExpSystemTypes,
        type: ExpTypes
    }

    enum ExpOperations {
        WRITE = 1280,
        READ
    }

    enum Predicates {
        EQUAL,
        RANGE
    }

    enum IndexDataType {
        STRING,
        NUMERIC,
        GEO2DSPHERE
    }

    enum IndexType {
        DEFAULT,
        LIST,
        MAPKEYS,
        MAPVALUES
    }

    enum ListOrder {
        UNORDERED,
        ORDERED
    }

    enum ListSortFlags {
        DEFAULT,
        DROP_DUPLICATES
    }

    enum ListWriteFlags {
        DEFAULT,
        ADD_UNIQUE,
        INSERT_BOUNDED,
        NO_FAIL,
        PARTIAL
    }

    enum ListReturnType {
        NONE,
        INDEX,
        REVERSE_INDEX,
        RANK,
        REVERSE_RANK,
        COUNT,
        VALUE,
        EXISTS,
        INVERTED
    }

    enum MapsOrder {
        UNORDERED,
        KEY_ORDERED,
        KEY_VALUE_ORDERED = 3
    }

    enum MapsWriteMode {
        UPDATE,
        UPDATE_ONLY,
        CREATE_ONLY
    }

    enum MapsWriteFlags {
        DEFAULT,
        CREATE_ONLY,
        UPDATE_ONLY,
        NO_FAIL,
        PARTIAL
    }

    enum MapReturnType {
        NONE,
        INDEX,
        REVERSE_INDEX,
        RANK,
        REVERSE_RANK,
        COUNT,
        KEY,
        VALUE,
        KEY_VALUE,
        EXISTS,
        UNORDERED_MAP,
        ORDERED_MAP,
        INVERTED
    }

    enum ScalarOperations {
        WRITE,
        READ,
        INCR,
        PREPEND,
        APPEND,
        TOUCH,
        DELETE
    }

    enum PolicyGen {
        IGNORE,
        EQ,
        GT
    }

    enum PolicyKey {
        DIGEST,
        SEND
    }

    enum PolicyExists {
        IGNORE,
        CREATE,
        UPDATE,
        REPLACE,
        CREATE_OR_REPLACE
    }

    enum PolicyReplica {
        MASTER,
        ANY,
        SEQUENCE,
        PREFER_RACK
    }

    enum PolicyReadModeAP {
        ONE,
        ALL
    }

    enum PolicyReadModeSC {
        SESSION,
        LINEARIZE,
        ALLOW_REPLICA,
        ALLOW_UNAVAILABLE
    }

    enum PolicyCommitLevel {
        ALL,
        MASTER
    }

    enum BitwiseWriteFlags {
        DEFAULT,
        CREATE_ONLY,
        UPDATE_ONLY,
        NO_FAIL,
        PARTIAL = 8
    }

    enum BitwiseResizeFlags {
        DEFAULT,
        FROM_FRONT,
        GROW_ONLY,
        SHRINK_ONLY = 4
    }

    enum BitwiseOverflow {
        FAIL,
        SATURATE = 2,
        WRAP = 4
    }

    enum HLLWriteFlags {
        DEFAULT,
        CREATE_ONLY,
        UPDATE_ONLY,
        NO_FAIL = 4,
        ALLOW_FOLD = 8
    }

    enum LogLevel {
        OFF = -1,
        ERROR,
        WARN,
        INFO,
        DEBUG,
        TRACE,
        DETAIL
    }

    enum Auth {
        INTERNAL,
        EXTERNAL,
        EXTERNAL_INSECURE,
        AUTH_PKI
    }

    enum Language {
        LUA
    }

    enum Log {
        OFF = -1,
        ERROR,
        WARN,
        INFO,
        DEBUG,
        TRACE,
        DETAIL = 4
    }

    enum TTL {
        DONT_UPDATE = -2,
        NEVER_EXPIRE,
        NAMESPACE_DEFAULT
    }

    enum JobStatus {
        UNDEF,
        INPROGRESS,
        COMPLETED
    }

    enum Status {
        AEROSPIKE_ERR_ASYNC_QUEUE_FULL = -11,
        AEROSPIKE_ERR_CONNECTION,
        AEROSPIKE_ERR_TLS_ERROR,
        AEROSPIKE_ERR_INVALID_NODE,
        AEROSPIKE_ERR_NO_MORE_CONNECTIONS,
        AEROSPIKE_ERR_ASYNC_CONNECTION,
        AEROSPIKE_ERR_CLIENT_ABORT,
        AEROSPIKE_ERR_INVALID_HOST,
        AEROSPIKE_NO_MORE_RECORDS,
        AEROSPIKE_ERR_PARAM,
        AEROSPIKE_ERR_CLIENT,
        AEROSPIKE_OK,
        AEROSPIKE_ERR_SERVER,
        AEROSPIKE_ERR_RECORD_NOT_FOUND,
        AEROSPIKE_ERR_RECORD_GENERATION,
        AEROSPIKE_ERR_REQUEST_INVALID,
        AEROSPIKE_ERR_RECORD_EXISTS,
        AEROSPIKE_ERR_BIN_EXISTS,
        AEROSPIKE_ERR_CLUSTER_CHANGE,
        AEROSPIKE_ERR_SERVER_FULL,
        AEROSPIKE_ERR_TIMEOUT,
        AEROSPIKE_ERR_ALWAYS_FORBIDDEN,
        AEROSPIKE_ERR_CLUSTER,
        AEROSPIKE_ERR_BIN_INCOMPATIBLE_TYPE,
        AEROSPIKE_ERR_RECORD_TOO_BIG,
        AEROSPIKE_ERR_RECORD_BUSY,
        AEROSPIKE_ERR_SCAN_ABORTED,
        AEROSPIKE_ERR_UNSUPPORTED_FEATURE,
        AEROSPIKE_ERR_BIN_NOT_FOUND,
        AEROSPIKE_ERR_DEVICE_OVERLOAD,
        AEROSPIKE_ERR_RECORD_KEY_MISMATCH,
        AEROSPIKE_ERR_NAMESPACE_NOT_FOUND,
        AEROSPIKE_ERR_BIN_NAME,
        AEROSPIKE_ERR_FAIL_FORBIDDEN,
        AEROSPIKE_ERR_FAIL_ELEMENT_NOT_FOUND,
        AEROSPIKE_ERR_FAIL_ELEMENT_EXISTS,
        AEROSPIKE_ERR_ENTERPRISE_ONLY,
        AEROSPIKE_ERR_OP_NOT_APPLICABLE,
        AEROSPIKE_FILTERED_OUT,
        AEROSPIKE_LOST_CONFLICT,
        AEROSPIKE_QUERY_END = 50,
        AEROSPIKE_SECURITY_NOT_SUPPORTED,
        AEROSPIKE_SECURITY_NOT_ENABLED,
        AEROSPIKE_SECURITY_SCHEME_NOT_SUPPORTED,
        AEROSPIKE_INVALID_COMMAND,
        AEROSPIKE_INVALID_FIELD,
        AEROSPIKE_ILLEGAL_STATE,
        AEROSPIKE_INVALID_USER = 60,
        AEROSPIKE_USER_ALREADY_EXISTS,
        AEROSPIKE_INVALID_PASSWORD,
        AEROSPIKE_EXPIRED_PASSWORD,
        AEROSPIKE_FORBIDDEN_PASSWORD,
        AEROSPIKE_INVALID_CREDENTIAL,
        AEROSPIKE_INVALID_ROLE = 70,
        AEROSPIKE_ROLE_ALREADY_EXISTS,
        AEROSPIKE_INVALID_PRIVILEGE,
        AEROSPIKE_INVALID_WHITELIST,
        AEROSPIKE_QUOTAS_NOT_ENABLED,
        AEROSPIKE_INVALID_QUOTA,
        AEROSPIKE_NOT_AUTHENTICATED = 80,
        AEROSPIKE_ROLE_VIOLATION,
        AEROSPIKE_ERR_UDF = 100,
        AEROSPIKE_ERR_BATCH_DISABLED = 150,
        AEROSPIKE_ERR_BATCH_MAX_REQUESTS_EXCEEDED,
        AEROSPIKE_ERR_BATCH_QUEUES_FULL,
        AEROSPIKE_ERR_GEO_INVALID_GEOJSON = 160,
        AEROSPIKE_ERR_INDEX_FOUND = 200,
        AEROSPIKE_ERR_INDEX_NOT_FOUND,
        AEROSPIKE_ERR_INDEX_OOM,
        AEROSPIKE_ERR_INDEX_NOT_READABLE,
        AEROSPIKE_ERR_INDEX,
        AEROSPIKE_ERR_INDEX_NAME_MAXLEN,
        AEROSPIKE_ERR_INDEX_MAXCOUNT,
        AEROSPIKE_ERR_QUERY_ABORTED = 210,
        AEROSPIKE_ERR_QUERY_QUEUE_FULL,
        AEROSPIKE_ERR_QUERY_TIMEOUT,
        AEROSPIKE_ERR_QUERY,
        AEROSPIKE_ERR_UDF_NOT_FOUND = 1301,
        AEROSPIKE_ERR_LUA_FILE_NOT_FOUND,
        AEROSPIKE_BATCH_FAILED,
        AEROSPIKE_NO_RESPONSE,
        AEROSPIKE_MAX_ERROR_RATE,
        AEROSPIKE_USE_NORMAL_RETRY,
        AEROSPIKE_ERR_MAX_RETRIES_EXCEEDED
    }

    enum PrivilegeCode {
        USER_ADMIN = 0,
        SYS_ADMIN = 1,
        DATA_ADMIN = 2,
        UDF_ADMIN = 3,
        SINDEX_ADMIN = 4,
        READ = 10,
        READ_WRITE = 11,
        READ_WRITE_UDF = 12,
        WRITE = 13,
        TRUNCATE = 14
    }

    interface IAddonUDF {
        module: string;
        funcname: string;
        args: AerospikeRecordValue[];
    }

    interface IAddonNode {
        name: string;
        address: string;
    }

    interface IEventLoopStats {
        inFlight: number;
        queued: number;
    }

    interface IAddonConnectionStats {
        inPool: number;
        inUse: number;
        opened: number;
        closed: number;
    }

    interface IAddonNodeStats {
        name: string;
        syncConnections: IAddonConnectionStats;
        asyncConnections: IAddonConnectionStats;
    }

    interface IAddonStats {
        commands: IEventLoopStats;
        nodes: IAddonNodeStats[];
    }

    interface IAddonQueryOptions {
        filters: SindexFilterPredicate[];
        selected: string[];
        nobins: boolean;
        udf: IAddonUDF;
        ops: Operation[]
    }

    interface IAddonScanOptions {
        selected: string[];
        nobins: boolean;
        concurrent: boolean;
        udf: IAddonUDF;
        ops: Operation[]
    }

    interface IAddonEvent {
        name: string;
        [key: string]: any;
    }

    type AddonCallback = (error: Error | undefined, result: any) => void;
    type AddonEventCallback = (event: IAddonEvent) => void;

    class AddonAerospikeClient {
        public addSeedHost(hostname: string, port: number): void;
        public applyAsync(key: IKey, udf: IAddonUDF, policy: BasePolicy, callback: AddonCallback): void;
        public batchExists(keys: IKey[], policy: BasePolicy, callback: AddonCallback): void;
        public batchGet(keys: IKey[], policy: BasePolicy, callback: AddonCallback): void;
        public batchRead<T extends AerospikeBins = AerospikeBins>(records: AerospikeRecord<T>[], policy: BasePolicy, callback: AddonCallback): void;
        public batchSelect(keys: IKey[], bins: string[], policy: BasePolicy, callback: AddonCallback): void;
        public contextFromBase64(context: { context: string }): [number, number][];
        public contextToBase64(context: { context: CdtContext }): string;
        public close(): void;
        public connect(callback: AddonCallback): void;
        public existsAsync(key: IKey, policy: BasePolicy, callback: AddonCallback): void;
        public getAsync(key: IKey, policy: BasePolicy, callback: AddonCallback): void;
        public getNodes(): IAddonNode[];
        public getStats(): IAddonStats;
        public hasPendingAsyncCommands(): boolean;
        public indexCreate(ns: string, set: string, bin: string, indexName: string, indexType: IndexType, indexDataType: IndexDataType, context: CdtContext, policy: IInfoPolicyProps, callback: AddonCallback): void;
        public indexRemove(ns: string, indexName: string, policy: IInfoPolicyProps, callback: AddonCallback): void;
        public infoAny(request: string, policy: IInfoPolicyProps, callback: AddonCallback): void;
        public infoForeach(request: string, policy: IInfoPolicyProps, callback: AddonCallback): void;
        public infoHost(request: string, host: IHost, policy: IInfoPolicyProps, callback: AddonCallback): void;
        public infoNode(request: string, node: string, policy: IInfoPolicyProps, callback: AddonCallback): void;
        public isConnected(): boolean;
        public jobInfo(jobID: number, module: string, policy: IInfoPolicyProps, callback: AddonCallback): void;
        public operateAsync(key: IKey, operations: Operation[], meta: IRecordMetadata, policy: IOperatePolicyProps, callback: AddonCallback): void;
        public putAsync<T extends AerospikeBins = AerospikeBins>(key: IKey, record: AerospikeRecord<T>, meta: IRecordMetadata, policy: IWritePolicyProps, callback: AddonCallback): void;
        public queryApply(ns: string, set: string, options: IAddonQueryOptions, policy: IQueryPolicyProps, callback: AddonCallback): void;
        public queryAsync(ns: string, set: string, options: IAddonQueryOptions, policy: IQueryPolicyProps, callback: AddonCallback): void;
        public queryBackground(ns: string, set: string, options: IAddonQueryOptions, policy: IQueryPolicyProps, queryID: number, callback: AddonCallback);
        public queryForeach(ns: string, set: string, options: IAddonQueryOptions, policy: IQueryPolicyProps, callback: AddonCallback): void;
        public removeAsync(key: IKey, policy: IRemovePolicyProps, callback: AddonCallback): void;
        public removeSeedHost(hostname: string, port: number): void;
        public scanAsync(ns: string, set: string, options: IAddonScanOptions, policy: IScanPolicyProps, scanID: number, callback: AddonCallback): void;
        public scanBackground(ns: string, set: string, options: IAddonScanOptions, policy: IScanPolicyProps, scanID: number, callback: AddonCallback): void;
        public selectAsync(key: string, bins: string[], policy: IReadPolicyProps, callback: AddonCallback): void;
        public setupEventCb(callback: AddonEventCallback): void;
        public truncate(ns: string, set: string, beforeNanos: number, policy: IInfoPolicyProps, callback: AddonCallback): void;
        public udfRegister(filename: string, type: Language, policy: IInfoPolicyProps, callback: AddonCallback): void;
        public udfRemove(module: string, policy: IInfoPolicyProps, callback: AddonCallback): void;
        public updateLogging(log: ILogInfo): AddonAerospikeClient;
    }

    // bin.js
    export class Bin {
        constructor(name: string, value: AerospikeRecordValue | Map<AerospikeMapKey, any>, mapOrder?: MapsOrder);
        public name: string;
        public value: AerospikeRecordValue | Map<AerospikeMapKey, any>;
    }

    // filter.js
    class SindexFilterPredicate {
        public constructor (
            predicate: Predicates,
            bin: string,
            dataType: IndexDataType,
            indexType: IndexType,
            context: CdtContext,
            props?: Record<string, any>
        );
        public predicate: Predicates;
        public bin: string;
        public datatype: IndexDataType;
        public context: CdtContext;
        public type: IndexType;
    }

    class EqualPredicate extends SindexFilterPredicate {
        constructor(bin: string, value: string | number, dataType: IndexDataType, indexType: IndexType, context: CdtContext);
        public val: string | number;
    }

    class RangePredicate extends SindexFilterPredicate {
        constructor(bin: string, min: number, max: number, dataType: IndexDataType, indexType: IndexType, context: CdtContext);
        public min: number;
        public max: number;
    }

    class GeoPredicate extends SindexFilterPredicate {
        constructor (bin: string, value: GeoJSON, indexType: IndexType, context: CdtContext);
        public val: GeoJSON;
    }

    // query.js
    interface IQueryOptions {
        udf?: IAddonUDF; // query.js#581 Why udf with caps?
        filters?: SindexFilterPredicate[];
        select?: string[];
        nobins?: boolean;
        paginate?: boolean;
        maxRecords?: number;
        ttl?: number;
    }

    class Query {
        public client: Client;
        public ns: string;
        public set: string;
        public filters: SindexFilterPredicate[] | undefined;
        public selected: string[] | undefined;
        public nobins: boolean | undefined;
        public ops: Operation[] | undefined;
        public udf: IAddonUDF | undefined;
        private pfEnabled: boolean;
        public paginate: boolean | undefined;
        public maxRecords: number | undefined;
        public queryState: number | null | undefined /* ??? */;
        public ttl: number | undefined;
        constructor(client: Client, ns: string, set: string, options?: IQueryOptions);
        public nextPage(state: number): void;
        public hasNextPage(): boolean;
        public select(bins: string[]): void;
        public select(...bins: string[]): void;
        public where(indexFilter: SindexFilterPredicate): void;
        public setSindexFilter(sindexFilter: SindexFilterPredicate): void;
        public setUdf(udfModule: string, udfFunction: string, udfArgs?: any[]): void;
        public foreach<T extends AerospikeBins = AerospikeBins>(policy?: IQueryPolicyProps, dataCb?: (data: AerospikeRecord<T>) => void, errorCb?: (error: Error) => void, endCb?: (queryState?: number) => void): RecordStream;
        public results<T extends AerospikeBins = AerospikeBins>(policy?: IQueryPolicyProps): Promise<AerospikeRecord<T>[]>;
        public apply(udfModule: string, udfFunction: string, udfArgs?: any[], policy?: IQueryPolicyProps): Promise<AerospikeRecordValue>;
        public apply(udfModule: string, udfFunction: string, callback: TypedCallback<AerospikeRecordValue>): void;
        public apply(udfModule: string, udfFunction: string, udfArgs: any[], callback: TypedCallback<AerospikeRecordValue>): void;
        public apply(udfModule: string, udfFunction: string, udfArgs: any[], policy: IQueryPolicyProps, callback: TypedCallback<AerospikeRecordValue>): void;
        public background(udfModule: string, udfFunction: string, udfArgs?: any[], policy?: IWritePolicyProps, queryID?: number): Promise<Job>;
        public background(udfModule: string, udfFunction: string, callback: TypedCallback<Job>): void;
        public background(udfModule: string, udfFunction: string, udfArgs: any[], callback: TypedCallback<Job>): void;
        public background(udfModule: string, udfFunction: string, udfArgs: any[], callback: TypedCallback<Job>): void;
        public background(udfModule: string, udfFunction: string, udfArgs: any[], policy: IWritePolicyProps, callback: TypedCallback<Job>): void;
        public background(udfModule: string, udfFunction: string, udfArgs: any[], policy: IWritePolicyProps, queryID: number, callback: TypedCallback<Job>): void;
        public operate(operations: Operation[], policy?: IQueryPolicyProps, queryID?: number): Promise<Job>;
        public operate(operations: Operation[], callback: TypedCallback<Job>): void;
        public operate(operations: Operation[], policy: IQueryPolicyProps, callback: TypedCallback<Job>): void;
        public operate(operations: Operation[], policy: IQueryPolicyProps, queryID: number, callback: TypedCallback<Job>): void;
    }

    // cdt_context.js
    enum CdtItemTypes {
        LIST_INDEX = 0x10,
        LIST_RANK,
        LIST_VALUE = 0x13,
        MAP_INDEX = 0x20,
        MAP_RANK,
        MAP_KEY,
        MAP_VALUE
    }

    class CdtItems extends Array {
        public push(v: [number, CdtContext]);
    }

    class CdtContext {
        public items: CdtItems;
        private add(type: CdtItemTypes, value: CdtContext): CdtContext;
        public addListIndex(index: number): CdtContext;
        public addListRank(rank: number): CdtContext;
        public addListValue(value: AerospikeRecordValue): CdtContext;
        public addMapIndex(index: number): CdtContext;
        public addMapRank(rank: number): CdtContext;
        public addMapKey(key: string): CdtContext;
        public addMapValue(value: AerospikeRecordValue): CdtContext;
        static getContextType(ctx: CdtContext, type: CdtItemTypes): ExpTypes | CdtItemTypes;
    }

    // operations.js
    class Operation {
        public op: ScalarOperations;
        public bin: string;
        constructor(op: ScalarOperations, bin: string, props?: Record<string, any>);
    }

    class WriteOperation extends Operation {
        public value: any;
    }

    class AddOperation extends Operation {
        public value: number | Double;
    }

    class AppendOperation extends Operation {
        public value: string | Buffer;
    }

    class PrependOperation extends Operation {
        public value: string | Buffer;
    }

    class TouchOperation extends Operation {
        public ttl: number;
    }

    class ListOperation extends Operation {
        public andReturn(returnType: ListReturnType): ListOperation;
        public withContext(contextOrFunction: CdtContext | Function): ListOperation;
        public invertSelection(): void;
    }

    class InvertibleListOp extends ListOperation {
        public inverted: boolean;
        public invertSelection(): InvertibleListOp;
    }

    class MapOperation extends Operation {
        andReturn(returnType: MapReturnType): MapOperation;
        public withContext(contextOrFunction: CdtContext | Function): MapOperation;
    }

    class BitwiseOperation extends Operation {
        withPolicy(policy: IBitwisePolicyProps): BitwiseOperation;
    }

    class OverflowableBitwiseOp extends BitwiseOperation {
        public overflowAction: BitwiseOverflow;
        public onOverflow(action: BitwiseOverflow): OverflowableBitwiseOp;
    }

    // exp_operations.js
    class ExpOperation extends Operation {
        public exp: AerospikeExp;
        public flags: number;
        constructor(op: ExpOperations, bin: string, exp: AerospikeExp, flags: number, props?: Record<string, any>);
    }

    type AnyOperation = Operation | ExpOperation;

    // policies
    interface IBasePolicyProps {
        socketTimeout?: number;
        totalTimeout?: number;
        timeout?: number;
        maxRetries?: number;
        compress?: boolean;
        filterExpression?: AerospikeExp;
    }

    export class BasePolicy implements IBasePolicyProps {
        public socketTimeout?: number;
        public totalTimeout?: number;
        public maxRetries?: number;
        public filterExpression?: AerospikeExp;
        public compress?: boolean;

        constructor(props?: IBasePolicyProps);
    }

    interface IApplyPolicyProps extends IBasePolicyProps {
        key?: PolicyKey;
        commitLevel?: PolicyCommitLevel;
        ttl?: number;
        durableDelete?: boolean;
    }

    export class ApplyPolicy extends BasePolicy implements IApplyPolicyProps {
        public key?: PolicyKey;
        public commitLevel?: PolicyCommitLevel;
        public ttl?: number;
        public durableDelete?: boolean;
        constructor(props?: IApplyPolicyProps);
    }

    interface IBatchPolicyProps extends IBasePolicyProps {
        deserialize?: boolean;
        allowInline?: boolean;
        sendSetName?: boolean;
        readModeAP?: PolicyReadModeAP;
        readModeSC?: PolicyReadModeSC;
    }

    export class BatchPolicy extends BasePolicy implements IBatchPolicyProps {
        public deserialize?: boolean;
        public allowInline?: boolean;
        public sendSetName?: boolean;
        public readModeAP?: PolicyReadModeAP;
        public readModeSC?: PolicyReadModeSC;
        constructor(props?: IBatchPolicyProps)
    }

    interface IBitwisePolicyProps extends IBatchPolicyProps {
        writeFlags?: BitwiseWriteFlags
    }

    class BitwisePolicy extends BasePolicy implements IBitwisePolicyProps {
        public writeFlags?: BitwiseWriteFlags;
        constructor(props?: IBitwisePolicyProps);
    }

    interface ICommandQueuePolicyProps extends IBasePolicyProps {
        maxCommandsInProcess?: number;
        maxCommandsInQueue?: number;
        queueInitialCapacity?: number;
    }

    export class CommandQueuePolicy extends BasePolicy implements ICommandQueuePolicyProps {
        public maxCommandsInProcess?: number;
        public maxCommandsInQueue?: number;
        public queueInitialCapacity?: number;
        constructor(props?: ICommandQueuePolicyProps);
    }

    interface IHLLPolicyProps extends IBasePolicyProps {
        writeFlags?: HLLWriteFlags;
    }

    class HLLPolicy extends BasePolicy implements IHLLPolicyProps {
        public writeFlags?: HLLWriteFlags;
        constructor(props?: IHLLPolicyProps);
    }

    interface IInfoPolicyProps extends IBasePolicyProps {
        sendAsIs?: boolean;
        checkBounds?: boolean;
    }

    export class InfoPolicy extends BasePolicy implements IInfoPolicyProps {
        public sendAsIs?: boolean;
        public checkBounds?: boolean;
        constructor(props?: IInfoPolicyProps);
    }

    interface IAdminPolicyProps {
        timeout?: number;
    }

    export class AdminPolicy implements IAdminPolicyProps {
        public timeout?: number;
        constructor(props?: IAdminPolicyProps);
    }

    interface IListPolicyProps extends IBasePolicyProps {
        order?: ListOrder;
        writeFlags?: ListWriteFlags;
    }

    export class ListPolicy extends BasePolicy implements IListPolicyProps {
        public order?: ListOrder;
        public writeFlags?: ListWriteFlags;
        constructor(props?: IListPolicyProps);
    }

    interface IMapPolicyProps extends IBasePolicyProps {
        order?: MapsOrder;
        writeMode?: MapsWriteMode;
        writeFlags?: MapsWriteFlags;
    }

    export class MapPolicy extends BasePolicy implements IMapPolicyProps {
        public order?: MapsOrder;
        public writeMode?: MapsWriteMode;
        public writeFlags?: MapsWriteFlags;
        constructor(props?: IMapPolicyProps);
    }

    interface IOperatePolicyProps extends IBasePolicyProps {
        key?: PolicyKey;
        gen?: PolicyGen;
        exists?: PolicyExists;
        replica?: PolicyReplica;
        commitLevel?: PolicyCommitLevel;
        deserialize?: boolean;
        durableDelete?: boolean;
        readModeAP?: PolicyReadModeAP;
        readModeSC?: PolicyReadModeSC;
    }

    export class OperatePolicy extends BasePolicy implements IOperatePolicyProps {
        public key?: PolicyKey;
        public gen?: PolicyGen;
        public exists?: PolicyExists;
        public replica?: PolicyReplica;
        public commitLevel?: PolicyCommitLevel;
        public deserialize: boolean;
        public durableDelete: boolean;
        public readModeAP: PolicyReadModeAP;
        public readModeSC: PolicyReadModeSC;
        constructor(props?: IOperatePolicyProps);
    }

    interface IQueryPolicyProps extends IBasePolicyProps {
        deserialize?: boolean;
        failOnClusterChange?: boolean;
        replica?: PolicyReplica;
    }

    export class QueryPolicy extends BasePolicy implements IQueryPolicyProps {
        public deserialize?: boolean;
        public failOnClusterChange?: boolean;
        public filterExpression?: AerospikeExp;
        public replica?: PolicyReplica;
        constructor(props?: IQueryPolicyProps);
    }

    interface IReadPolicyProps extends IBasePolicyProps {
        key?: PolicyKey;
        replica?: PolicyReplica;
        readModeAP?: PolicyReadModeAP;
        readModeSC?: PolicyReadModeSC;
        deserialize?: boolean;
    }

    export class ReadPolicy extends BasePolicy implements IReadPolicyProps {
        public key?: PolicyKey;
        public replica?: PolicyReplica;
        public readModeAP?: PolicyReadModeAP;
        public readModeSC?: PolicyReadModeSC;
        public deserialize?: boolean;
        constructor(props?: IReadPolicyProps);
    }

    interface IRemovePolicyProps extends IBasePolicyProps {
        generation?: number;
        key?: PolicyKey;
        gen?: PolicyGen;
        commitLevel?: PolicyCommitLevel;
        durableDelete?: boolean;
    }

    export class RemovePolicy extends BasePolicy implements IRemovePolicyProps {
        public generation?: number;
        public key?: PolicyKey;
        public gen?: PolicyGen;
        public commitLevel?: PolicyCommitLevel;
        public durableDelete?: boolean;
        constructor(props?: IRemovePolicyProps);
    }

    interface IScanPolicyProps extends IBasePolicyProps {
        durableDelete?: boolean;
        recordsPerSecond?: number;
        maxRecords?: number;
        replica?: PolicyReplica;
    }

    export class ScanPolicy extends BasePolicy implements IScanPolicyProps {
        public durableDelete?: boolean;
        public recordsPerSecond?: number;
        public maxRecords?: number; // server version >= 4.9, so probably it should be optional
        public replica?: PolicyReplica;
        constructor(props?: IScanPolicyProps);
    }

    interface IWritePolicyProps extends IBasePolicyProps {
        compressionThreshold?: number;
        key?: PolicyKey;
        gen?: PolicyGen;
        exists?: PolicyExists;
        commitLevel?: PolicyCommitLevel;
        durableDelete?: boolean;
    }

    export class WritePolicy extends BasePolicy implements IWritePolicyProps {
        public compressionThreshold?: number;
        public key?: PolicyKey;
        public gen?: PolicyGen;
        public exists?: PolicyExists;
        public commitLevel?: PolicyCommitLevel;
        public durableDelete?: boolean;
        constructor(props?: IWritePolicyProps);
    }

    interface IBatchApplyPolicyProps {
        filterExpression?: AerospikeExp;
        key?: PolicyKey;
        commitLevel?: PolicyCommitLevel;
        ttl?: number;
        durableDelete?: boolean;
    }

    export class BatchApplyPolicy implements IBatchApplyPolicyProps {
        public filterExpression?: AerospikeExp;
        public key?: PolicyKey;
        public commitLevel?: PolicyCommitLevel;
        public ttl?: number;
        public durableDelete?: boolean;
        constructor(props?: IBatchApplyPolicyProps);
    }

    interface IBatchReadPolicyProps {
        filterExpression?: AerospikeExp;
        readModeAP?: PolicyReadModeAP;
        readModeSC?: PolicyReadModeSC;
    }

    export class BatchReadPolicy  implements IBatchReadPolicyProps{
        public filterExpression?: AerospikeExp;
        public readModeAP?: PolicyReadModeAP;
        public readModeSC?: PolicyReadModeSC;
        constructor(props?: IBatchReadPolicyProps);
    }

    interface IBatchRemovePolicyProps {
        filterExpression?: AerospikeExp;
        key?: PolicyKey;
        commitLevel?: PolicyCommitLevel;
        gen?: PolicyGen;
        generation?: number;
        durableDelete?: boolean;
    }

    export class BatchRemovePolicy implements IBatchRemovePolicyProps {
        public filterExpression?: AerospikeExp;
        public key?: PolicyKey;
        public commitLevel?: PolicyCommitLevel;
        public gen?: PolicyGen;
        public generation?: number;
        public durableDelete?: boolean;
        constructor(props?: IBatchRemovePolicyProps);
    }

    interface IBatchWritePolicyProps {
        filterExpression?: AerospikeExp;
        ttl?: number;
        key?: PolicyKey;
        commitLevel?: PolicyCommitLevel;
        gen?: PolicyGen;
        exists?: PolicyExists;
        durableDelete?: boolean;
    }

    export class BatchWritePolicy implements IBatchWritePolicyProps {
        public filterExpression?: AerospikeExp;
        public ttl?: number;
        public key?: PolicyKey;
        public commitLevel?: PolicyCommitLevel;
        public gen?: PolicyGen;
        public exists?: PolicyExists;
        public durableDelete?: boolean;
        constructor(props?: IBatchWritePolicyProps);
    }

    // client.js
    interface IBatchReadRecord {
        key: IKey;
        bins?: string[];
        read_all_bins?: boolean;
    }

    interface IBatchSelectEntity {
        status: Status;
        key: IKey;
        meta?: IRecordMetadata;
        bins?: AerospikeBins;
    }

    interface IIndexOptions {
        ns: string;
        set: string;
        bin: string;
        index: string;
        type?: IndexType;
        datatype: IndexDataType;
    }

    interface ITypedIndexOptions {
        ns: string;
        set: string;
        bin: string;
        index: string;
        type?: IndexType;
    }

    type TypedCallback<T> = (error?: Error, result?: T) => void;

    type PickEnum<T, K extends T> = {
        [P in keyof K]: P extends K ? P : never;
    };

    interface IInfoNode {
        node_id: string;
    }

    interface IInfoAllResponse {
        host: IInfoNode;
        info: string;
    }

    interface IInfoNodeParam {
        name: string;
    }

    interface IBatchRecord {
        type: batchType;
        key: IKey;
        policy?: BatchReadPolicy;
        ops?: Operation[];
        bins?: string[];
        readAllBins?: boolean;
    }

    interface IBatchResult<T extends AerospikeBins = AerospikeBins> {
        status: Status;
        record: AerospikeRecord<T>;
    }

    export class Client extends EventEmitter {
        public config: Config;
        private as_client: AddonAerospikeClient;
        private connected: boolean;
        public captureStackTraces: boolean;
        constructor(config: IConfigOptions);
        private asExec(cmd: string, args?: any): any;
        public getNodes(): IAddonNode[];
        public addSeedHost(hostname: string, number?: number): void;
        public contextToBase64(context: CdtContext): string;
        public contextFromBase64(serializedContext: string): CdtContext;
        public changePassword(user: string, password: string, policy?: IAdminPolicyProps): void;
        public createUser(user: string, password: string, roles?: string[], policy?: IAdminPolicyProps): void;
        public createRole(roleName: string, privileges: Privilege[], policy?: IAdminPolicyProps, whitelist?: string[], readQuota?: number, writeQuota?: number): void;
        public dropRole(roleName: string, policy?: IAdminPolicyProps): void;
        public dropUser(user: string, policy?: IAdminPolicyProps): void;
        public grantPrivileges(roleName: string, privileges: Privilege[], policy?: IAdminPolicyProps): void;
        public grantRoles(user: string, roles: string[], policy?: IAdminPolicyProps): void;
        public queryRole(roleName: string, policy?: IAdminPolicyProps): Promise<Role>;
        public queryRoles(policy?: IAdminPolicyProps): Promise<Role[]>;
        public queryUser(user: string, policy?: IAdminPolicyProps): Promise<User>;
        public queryUsers(policy?: IAdminPolicyProps): Promise<User[]>;
        public revokePrivileges(roleName: string, privileges: Privilege[], policy?: IAdminPolicyProps): void;
        public revokeRoles(user: string, roles: string[], policy?: IAdminPolicyProps): void;
        public setQuotas(roleName: string, readQuota: number, writeQuota: number, policy?: IAdminPolicyProps): void;
        public setWhitelist(roleName: string, whitelist: string[], policy?: IAdminPolicyProps): void;
        public removeSeedHost(hostname: string, number?: number): void;
        public batchExists(keys: IKey[], policy?: IBatchPolicyProps): Promise<IBatchResult[]>;
        public batchExists(keys: IKey[], callback: TypedCallback<IBatchResult[]>): void;
        public batchExists(keys: IKey[], policy: IBatchPolicyProps, callback: TypedCallback<IBatchResult[]>): void;
        public batchGet<T extends AerospikeBins = AerospikeBins>(keys: IKey[], policy?: IBatchPolicyProps): Promise<IBatchResult<T>[]>;
        public batchGet<T extends AerospikeBins = AerospikeBins>(keys: IKey[], callback: TypedCallback<IBatchResult<T>[]>): void;
        public batchGet<T extends AerospikeBins = AerospikeBins>(keys: IKey[], policy: IBatchPolicyProps, callback: TypedCallback<IBatchResult<T>[]>): void;
        public batchRead(records: Omit<IBatchRecord[], "type">, policy?: IBatchReadPolicyProps): Promise<IBatchResult[]>;
        public batchRead(records: Omit<IBatchRecord[], "type">, callback: TypedCallback<IBatchResult[]>): void;
        public batchRead(records: Omit<IBatchRecord[], "type">, policy: IBatchReadPolicyProps, callback: TypedCallback<IBatchResult[]>): void;
        public batchWrite(records: IBatchRecord[], policy?: IBatchWritePolicyProps): Promise<IBatchResult[]>;
        public batchWrite(records: IBatchRecord[], callback: TypedCallback<IBatchResult[]>): void;
        public batchWrite(records: IBatchRecord[], policy: IBatchReadPolicyProps, callback: TypedCallback<IBatchResult[]>): void;
        public batchApply(keys: IKey[], udf: IAddonUDF, batchPolicy?: IBatchPolicyProps, batchApplyPolicy?: IBatchApplyPolicyProps): Promise<IBatchResult[]>;
        public batchApply(keys: IKey[], udf: IAddonUDF, callback: TypedCallback<IBatchResult[]>): void;
        public batchApply(keys: IKey[], udf: IAddonUDF, batchPolicy: IBatchPolicyProps, callback: TypedCallback<IBatchResult[]>): void;
        public batchApply(keys: IKey[], udf: IAddonUDF, batchPolicy: IBatchPolicyProps, batchApplyPolicy: IBatchApplyPolicyProps, callback: TypedCallback<IBatchResult[]>): void;
        public batchRemove(keys: IKey[], batchPolicy?: IBatchPolicyProps, batchRemovePolicy?: IBatchRemovePolicyProps): Promise<IBatchResult[]>;
        public batchRemove(keys: IKey[], callback: TypedCallback<IBatchResult[]>): void;
        public batchRemove(keys: IKey[], batchPolicy: IBatchPolicyProps, callback: TypedCallback<IBatchResult[]>): void;
        public batchRemove(keys: IKey[], batchPolicy: IBatchPolicyProps, batchRemovePolicy: IBatchRemovePolicyProps, callback: TypedCallback<IBatchResult[]>): void;
        public batchSelect<T extends AerospikeBins = AerospikeBins>(keys: IKey[], bins: (keyof T)[], policy?: IBatchPolicyProps): Promise<IBatchResult<T>[]>;
        public batchSelect<T extends AerospikeBins = AerospikeBins>(keys: IKey[], bins: (keyof T)[], callback: TypedCallback<IBatchResult<T>[]>): void;
        public batchSelect<T extends AerospikeBins = AerospikeBins>(keys: IKey[], bins: (keyof T)[], policy: IBatchPolicyProps, callback: TypedCallback<IBatchResult<T>[]>): void;
        public close(releaseEventLoop?: boolean): void;
        public connect(callback?: TypedCallback<Client>): Promise<Client>;
        public createIndex(options: IIndexOptions, policy?: IInfoPolicyProps): Promise<IndexJob>;
        public createIndex(options: IIndexOptions, callback: TypedCallback<IndexJob>): void;
        public createIndex(options: IIndexOptions, policy: IInfoPolicyProps, callback: TypedCallback<IndexJob>): void;
        public createIntegerIndex(options: ITypedIndexOptions, policy: IInfoPolicyProps): Promise<IndexJob>;
        public createIntegerIndex(options: ITypedIndexOptions, callback: TypedCallback<IndexJob>): void;
        public createIntegerIndex(options: ITypedIndexOptions, policy: IInfoPolicyProps, callback: TypedCallback<IndexJob>): void;
        public createStringIndex(options: ITypedIndexOptions, policy: IInfoPolicyProps): Promise<IndexJob>;
        public createStringIndex(options: ITypedIndexOptions, callback: TypedCallback<IndexJob>): void;
        public createStringIndex(options: ITypedIndexOptions, policy: IInfoPolicyProps, callback: TypedCallback<IndexJob>): void;
        public createGeo2DSphereIndex(options: ITypedIndexOptions, policy: IInfoPolicyProps): Promise<IndexJob>;
        public createGeo2DSphereIndex(options: ITypedIndexOptions, callback: TypedCallback<IndexJob>): void;
        public createGeo2DSphereIndex(options: ITypedIndexOptions, policy: IInfoPolicyProps, callback: TypedCallback<IndexJob>): void;
        public createBlobIndex(options: ITypedIndexOptions, policy: IInfoPolicyProps): Promise<IndexJob>;
        public createBlobIndex(options: ITypedIndexOptions, callback: TypedCallback<IndexJob>): void;
        public createBlobIndex(options: ITypedIndexOptions, policy: IInfoPolicyProps, callback: TypedCallback<IndexJob>): void;
        public apply(key: IKey, udfArgs: IAddonUDF, policy?: IApplyPolicyProps): Promise<any>;
        public apply(key: IKey, udfArgs: IAddonUDF, callback: AddonCallback): void;
        public apply(key: IKey, udfArgs: IAddonUDF, policy: IApplyPolicyProps, callback: AddonCallback): void;
        public exists(key: IKey, policy?: IReadPolicyProps): Promise<boolean>;
        public exists(key: IKey, policy: IReadPolicyProps, callback: TypedCallback<boolean>): void;
        public get<T extends AerospikeBins = AerospikeBins>(key: IKey, policy?: IReadPolicyProps): Promise<AerospikeRecord<T>>;
        public get<T extends AerospikeBins = AerospikeBins>(key: IKey, policy: IReadPolicyProps, callback: TypedCallback<AerospikeRecord<T>>): void;
        public indexRemove(namespace: string, index: string, policy?: IInfoPolicyProps): Promise<void>;
        public indexRemove(namespace: string, index: string, callback: TypedCallback<void>): void;
        public indexRemove(namespace: string, index: string, policy: IInfoPolicyProps, callback: TypedCallback<void>): void;
        public info(request: string, host: IHost | string, policy?: IInfoPolicyProps): Promise<string>;
        public info(request: string | undefined, host: IHost | string, callback: TypedCallback<string>): void;
        public info(request: string | undefined, host: IHost | string, policy: IInfoPolicyProps, callback: TypedCallback<string>): void;
        public infoAny(request: string | undefined, policy?: IInfoPolicyProps): Promise<string>;
        public infoAny(request: string | undefined, callback: TypedCallback<string>): void;
        public infoAny(request: string | undefined, policy: IInfoPolicyProps, callback: TypedCallback<string>): void;
        public infoAll(request: string | undefined, policy?: IInfoPolicyProps): Promise<IInfoAllResponse[]>;
        public infoAll(request: string | undefined, callback: TypedCallback<IInfoAllResponse[]>): void;
        public infoAll(request: string | undefined, policy: IInfoPolicyProps, callback: TypedCallback<IInfoAllResponse[]>): void;
        public infoNode(request: string | undefined, node: IInfoNodeParam, policy?: IInfoPolicyProps): Promise<string>;
        public infoNode(request: string | undefined, node: IInfoNodeParam, callback: TypedCallback<string>): void;
        public infoNode(request: string | undefined, node: IInfoNodeParam, policy: IInfoPolicyProps, callback: TypedCallback<string>): void;
        public isConnected(checkTenderErrors?: boolean): boolean;
        public operate<T extends AerospikeBins = AerospikeBins>(key: IKey, operations: Operation[], metadata?: IRecordMetadata, policy?: IOperatePolicyProps): Promise<AerospikeRecord<T>>;
        public operate<T extends AerospikeBins = AerospikeBins>(key: IKey, operations: Operation[], callback: TypedCallback<AerospikeRecord<T>>): void;
        public operate<T extends AerospikeBins = AerospikeBins>(key: IKey, operations: Operation[], metadata: IRecordMetadata, callback: TypedCallback<AerospikeRecord<T>>): void;
        public operate<T extends AerospikeBins = AerospikeBins>(key: IKey, operations: Operation[], metadata: IRecordMetadata, policy: IOperatePolicyProps, callback: TypedCallback<AerospikeRecord<T>>): void;
        public append<T extends AerospikeBins = AerospikeBins>(key: IKey, bins: T, metadata?: IRecordMetadata, policy?: IOperatePolicyProps): Promise<AerospikeRecord<T>>;
        public append<T extends AerospikeBins = AerospikeBins>(key: IKey, bins: T, callback: TypedCallback<AerospikeRecord<T>>): void;
        public append<T extends AerospikeBins = AerospikeBins>(key: IKey, bins: T, metadata: IRecordMetadata, callback: TypedCallback<AerospikeRecord<T>>): void;
        public append<T extends AerospikeBins = AerospikeBins>(key: IKey, bins: T, metadata: IRecordMetadata, policy: IOperatePolicyProps, callback: TypedCallback<AerospikeRecord<T>>): void;
        public prepend<T extends AerospikeBins = AerospikeBins>(key: IKey, bins: T, callback: TypedCallback<AerospikeRecord<T>>): void;
        public prepend<T extends AerospikeBins = AerospikeBins>(key: IKey, bins: T, metadata: IRecordMetadata, callback: TypedCallback<AerospikeRecord<T>>): void;
        public prepend<T extends AerospikeBins = AerospikeBins>(key: IKey, bins: T, metadata: IRecordMetadata, policy: IOperatePolicyProps, callback: TypedCallback<AerospikeRecord<T>>): void;
        public add<T extends AerospikeBins = AerospikeBins>(key: IKey, bins: T, callback: TypedCallback<AerospikeRecord<T>>): void;
        public add<T extends AerospikeBins = AerospikeBins>(key: IKey, bins: T, metadata: IRecordMetadata, callback: TypedCallback<AerospikeRecord<T>>): void;
        public add<T extends AerospikeBins = AerospikeBins>(key: IKey, bins: T, metadata: IRecordMetadata, policy: IOperatePolicyProps, callback: TypedCallback<AerospikeRecord<T>>): void;
        public incr<T extends AerospikeBins = AerospikeBins>(key: IKey, bins: T, callback: TypedCallback<AerospikeRecord<T>>): void;
        public incr<T extends AerospikeBins = AerospikeBins>(key: IKey, bins: T, metadata: IRecordMetadata, callback: TypedCallback<AerospikeRecord<T>>): void;
        public incr<T extends AerospikeBins = AerospikeBins>(key: IKey, bins: T, metadata: IRecordMetadata, policy: IOperatePolicyProps, callback: TypedCallback<AerospikeRecord<T>>): void;
        public put<T extends AerospikeBins = AerospikeBins>(key: IKey, bins: T, meta?: IRecordMetadata, policy?: IWritePolicyProps): Promise<AerospikeRecord<T>>;
        public put<T extends AerospikeBins = AerospikeBins>(key: IKey, bins: T, callback: TypedCallback<AerospikeRecord<T>>): void;
        public put<T extends AerospikeBins = AerospikeBins>(key: IKey, bins: T, meta: IRecordMetadata, callback: TypedCallback<AerospikeRecord<T>>): void;
        public put<T extends AerospikeBins = AerospikeBins>(key: IKey, bins: T, meta: IRecordMetadata, policy: IWritePolicyProps, callback: TypedCallback<AerospikeRecord<T>>): void;
        public query(ns: string, set: string, options?: IQueryOptions): Query;
        public remove(key: IKey, policy?: IRemovePolicyProps): Promise<IKey>;
        public remove(key: IKey, callback: TypedCallback<IKey>): void;
        public remove(key: IKey, policy: IRemovePolicyProps, callback: TypedCallback<IKey>): void;
        public scan(ns: string, set: string, options?: IScanOptions): Scan;
        public select<T extends AerospikeBins = AerospikeBins>(key: IKey, bins: (keyof T)[], policy?: IReadPolicyProps): Promise<AerospikeRecord<T>>;
        public select<T extends AerospikeBins = AerospikeBins>(key: IKey, bins: (keyof T)[], callback: TypedCallback<AerospikeRecord<T>>): void;
        public select<T extends AerospikeBins = AerospikeBins>(key: IKey, bins: (keyof T)[], policy: IReadPolicyProps, callback: TypedCallback<AerospikeRecord<T>>): void;
        public truncate(ns: string, set: string | null, beforeNanos: number, policy?: IInfoPolicyProps): Promise<void>;
        public truncate(ns: string, set: string | null, beforeNanos: number, callback: TypedCallback<void>): void;
        public udfRegister(udfPath: string, udfType?: Language, policy?: IInfoPolicyProps): Promise<Job>;
        public udfRegister(udfPath: string, callback: TypedCallback<Job>): void;
        public udfRegister(udfPath: string, udfType: Language, callback: TypedCallback<Job>): void;
        public udfRegister(udfPath: string, udfType: Language, policy: IInfoPolicyProps, callback: TypedCallback<Job>): void;
        public stats(): IAddonStats;
        public udfRemove(udfModule: string, policy?: IInfoPolicyProps): Promise<Job>;
        public udfRemove(udfModule: string, callback: TypedCallback<Job>): void;
        public udfRemove(udfModule: string, policy: IInfoPolicyProps, callback: TypedCallback<Job>): void;
        public updateLogging(logConfig: ILogInfo): void;
        keyfilePassword?: string;
        certfile?: string;
        crlCheck?: boolean;
        crlCheckAll?: boolean;
        logSessionInfo?: boolean;
        forLoginOnly?: boolean;
    }

    interface IHost {
        addr: string;
        port?: number;
        tlsname?: string;
    }

    interface IConfigPolicies {
        apply?: IApplyPolicyProps;
        batch?: IBatchPolicyProps;
        info?: IInfoPolicyProps;
        operate?: IOperatePolicyProps;
        read?: IReadPolicyProps;
        remove?: IRemovePolicyProps
        scan?: IScanPolicyProps;
        query?: IQueryPolicyProps
        write?: IWritePolicyProps;
    }

    interface IConfigLog {
        level?: Log;
        file?: number;
    }

    interface IConfigModLua {
        userPath?: string;
    }

    interface IConfigSharedMemory {
        enable?: boolean;
        key: number;
        maxNodes?: number;
        maxNamespaces?: number;
        takeoverThresholdSeconds?: number;
    }

    interface IConfigTLS {
        enable?: boolean;
        cafile?: string;
        capath?: string;
        protocols?: string;
        cipherSuite?: string;
        certBlacklist?: string;
        keyfile?: string;
        keyfilePassword?: string;
        certfile?: string;
        crlCheck?: boolean;
        crlCheckAll?: boolean;
        logSessionInfo?: boolean;
        forLoginOnly?: boolean;
    }

    interface IConfigOptions {
        user?: string;
        password?: string;
        authMode?: Auth;
        clusterName?: string;
        port?: number;
        tls?: IConfigTLS;
        hosts?: IHost[] | string;
        policies?: IConfigPolicies;
        log?: IConfigLog;
        connTimeoutMs?: number;
        loginTimeoutMs?: number;
        maxSocketIdle?: number;
        tenderInterval?: number;
        maxConnsPerNode?: number;
        minConnsPerNode?: number;
        modlua?: IConfigModLua;
        sharedMemory?: IConfigSharedMemory;
        useAlternateAccessAddress?: boolean;
        rackAware?: boolean;
        rackId?: number;
        maxErrorRate?: number;
        errorRateWindow?: number;
    }

    export class Config {
        public user?: string;
        public password?: string;
        public authMode?: Auth;
        public clusterName?: string;
        public port: number;
        public tls?: IConfigTLS;
        public hosts: IHost[] | string;
        public policies: IConfigPolicies;
        public log?: IConfigLog;
        public connTimeoutMs?: number;
        public loginTimeoutMs?: number;
        public maxSocketIdle?: number;
        public tenderInterval?: number;
        public maxConnsPerNode?: number;
        public minConnsPerNode?: number;
        public modlua: IConfigModLua;
        public sharedMemory?: IConfigSharedMemory;
        public useAlternateAccessAddress: boolean;
        public rackAware?: boolean;
        public rackId?: number;
        public maxErrorRate?: number;
        public errorRateWindow?: number;
        constructor(config?: IConfigOptions);
        public setDefaultPolicies(policies?: IConfigPolicies): void;
    }

    // double.js
    export class Double {
        constructor(value: number);
        public Double: number;
        public value(): number;
    }

    // error.js
    export class AerospikeError extends Error {
        readonly code: Status;
        readonly command: Command | null;
        readonly func: string | null;
        readonly file: string | null;
        readonly line: number | null;
        readonly inDoubt: boolean;
        constructor(message: string, command: Command);
        static fromASError(asError: AerospikeError | Error, command: Command): AerospikeError;
        static copyASErrorProperties(target: AerospikeError, source: Error): void;
        static formatMessage(message: string, code: Status): string;
        private setStackTrace(stack: string): void;
        public isServerError(): boolean;
        get client(): Client | void;
    }

    // geojson.js
    type GeoJSONType = {
        type: string,
        coordinates: Array<number[] | number>
    }

    export class GeoJSON {
        public str: string;
        constructor(json: string | object);
        static Point(lng: number, lat: number): GeoJSON;
        static Polygon(...coordinates: number[][]): GeoJSON;
        static Circle(lng: number, lat: number, radius: number);
        public toJSON(): GeoJSONType;
        public value(): GeoJSONType;
        public toString(): string;
    }

    // hll.js
    class HLLOperation extends Operation {
        public withPolicy(policy: IHLLPolicyProps): HLLOperation;
    }

    // index_job.js
    interface ISindexInfoEntity {
        load_pct: number;
    }
    class IndexJob extends Job<ISindexInfoEntity> {
        public namespace: string;
        public indexName: string;
        constructor(client: Client, namespace: string, indexName: string);
    }

    // job.js
    interface IJobInfoResponse {
        progressPct: number;
        recordsRead: number;
        status: JobStatus;
    }

    class Job<T = IJobInfoResponse> {
        public client: Client;
        public jobID: number;
        public module: string;
        constructor(client: Client, jobID: number, module: string);
        static safeRandomJobID(): number;
        static pollUntilDone(statusFunction: () => Promise<boolean>, pollInterval?: number): Promise<void>;
        private hasCompleted(info: T): boolean;
        private checkStatus(): Promise<boolean>;
        public info(policy?: IInfoPolicyProps): Promise<T>;
        public info(callback: TypedCallback<T>): void;
        public info(policy: IInfoPolicyProps, callback: TypedCallback<T>): void;
        public wait(poolInterval?: number): Promise<void>;
        public wait(callback: TypedCallback<void>): void;
        public wait(pollInterval: number, callback: TypedCallback<void>): void;
        public waitUntilDone(pollInterval?: number): Promise<void>;
        public waitUntilDone(callback: TypedCallback<void>): void;
        public waitUntilDone(pollInterval: number, callback: TypedCallback<void>): void;
    }

    // key.js
    interface IKey {
        ns: string;
        set: string;
        key?: string | number | Buffer;
        digest?: Buffer;
    }

    class Key implements IKey {
        public ns: string;
        public set: string;
        public key: string | number | Buffer;
        public digest: Buffer | undefined;
        constructor(ns: string, set: string, key: string | number | Buffer, digest?: Buffer);
        static fromASKey(keyObj: IKey): Key;
        public equals(other: IKey): boolean;
    }

    // record.js
    interface IRecordMetadata {
        ttl?: number;
        gen?: number;
    }

    // record_stream.js
    class RecordStream extends Stream {
        public aborted: boolean;
        public client: Client;
        public writable: boolean;
        public readable: boolean;
        public _read(): void;
        public abort(): void;
    }

    // scan.js
    interface IScanOptions {
        select?: string[];
        nobins?: boolean;
        concurrent?: boolean;
        paginate?: boolean;
        ttl?: number;
    }

    interface IScanState {
        bytes: number[];
    }

    class Scan {
        public client: Client;
        public ns: string;
        public set: string;
        public selected: string[] | undefined;
        public nobins: boolean | undefined;
        public concurrent: boolean | undefined;
        private pfEnabled: boolean;
        public paginate: boolean | undefined;
        public scanState: IScanState | null | undefined;
        public ttl: number | undefined;
        public udf?: IAddonUDF;
        public ops?: Operation[];
        constructor(client: Client, ns: string, set: string, options?: IScanOptions);
        public nextPage(state: IScanState): void;
        public hasNextPage(): boolean;
        public select(bins: string[]): void;
        public select(...bins: string[]): void;
        public background(udfModule: string, udfFunction: string, udfArgs?: any[], policy?: IScanPolicyProps, scanID?: number): Promise<Job>;
        public background(udfModule: string, udfFunction: string, callback: TypedCallback<Job>): void;
        public background(udfModule: string, udfFunction: string, udfArgs: any[], callback: TypedCallback<Job>): void;
        public background(udfModule: string, udfFunction: string, udfArgs: any[], policy: IScanPolicyProps, callback: TypedCallback<Job>): void;
        public background(udfModule: string, udfFunction: string, udfArgs: any[], policy: IScanPolicyProps, scanID: number, callback: TypedCallback<Job>): void;
        public operate(operations: Operation[], policy?: IScanPolicyProps, scanID?: number): Promise<Job>;
        public operate(operations: Operation[], policy: IScanPolicyProps, scanID: number, callback: TypedCallback<Job>): void;
        public foreach<T extends AerospikeBins = AerospikeBins>(policy?: IScanPolicyProps, dataCb?: (data: AerospikeRecord<T>) => void, errorCb?: (error: Error) => void, endCb?: (scanState?: IScanState) => void): RecordStream;
        public results<T extends AerospikeBins = AerospikeBins>(policy?: IScanPolicyProps): Promise<AerospikeRecord<T>[]>;
    }

    // exp.js
    type AerospikeExp = { op: number, [key: string]: any }[]

    enum ExpReadFlags {
        DEFAULT,
        EVAL_NO_FAIL
    }
    enum ExpWriteFlags {
        DEFAULT,
        CREATE_ONLY,
        UPDATE_ONLY,
        ALLOW_DELETE,
        POLICY_NO_FAIL,
        EVAL_NO_FAIL
    }

    // user.js
    interface IUserOptions {
        connsInUse?: number;
        name?: string;
        readInfo?: number[];
        writeInfo?: number[];
        roles?: string[];
    }

    class User {
        constructor(options: IUserOptions);
        public connsInUse: number;
        public name: string;
        public readInfo: number[];
        public writeInfo: number[];
        public roles: string[];
    }

    // role.js
    interface IRoleOptions {
        name?: string;
        readQuota?: number;
        writeQuota?: number;
        whitelist?: string[];
        privileges?: Privilege[];
    }

    class Role {
        public name: string;
        public readQuota: number;
        public writeQuota: number;
        public whitelist: string[];
        public privileges: Privilege[];
    }

    // privilege.js
    interface IPrivilegeOptions {
        namespace?: string;
        set?: string;
    }

    class Privilege {
        constructor(code: PrivilegeCode, options: IPrivilegeOptions)
        options: Record<string, any>;
        public code: PrivilegeCode;
        public namespace: string;
        public set: string;
    }

    // admin.js
    interface AdminModule {
        User: typeof User;
        Role: typeof Role;
        Privilege: typeof Privilege;
    }

    class AerospikeRecord<T extends AerospikeBins = AerospikeBins> {
        public key: IKey;
        public bins: T;
        public ttl: number;
        public gen: number;
        constructor(key: IKey, bins: T, metadata?: IRecordMetadata);
    }

    export interface FilterModule {
        SindexFilterPredicate: typeof SindexFilterPredicate,
        range(bin: string, min: number, max: number, indexType?: IndexType, context?: CdtContext): RangePredicate;
        equal(bin: string, value: string | number | Double | Buffer): EqualPredicate;
        contains(bin: string, value: string | number | Double | Buffer, indexType?: IndexType, context?: CdtContext): EqualPredicate;
        geoWithinGeoJSONRegion(bin: string, value: GeoJSON, indexType?: IndexType, context?: CdtContext): GeoPredicate;
        geoContainsGeoJSONPoint(bin: string, value: GeoJSON, indexType?: IndexType, context?: CdtContext): GeoPredicate;
        geoWithinRadius(bin: string, lng: number, lat: number, radius: number, indexType?: IndexType, context?: CdtContext): GeoPredicate;
        geoContainsPoint(bin: string, lng: number, lat: number, indexType?: IndexType, context?: CdtContext): GeoPredicate;
    }

    export interface ListsModule {
        order: typeof ListOrder;
        sortFlags: typeof ListSortFlags;
        writeFlags: typeof ListWriteFlags;
        returnType: typeof ListReturnType;
        setOrder(bin: string, order: ListOrder): ListOperation;
        sort(bin: string, flags: ListSortFlags): ListOperation;
        append(bin: string, value: AerospikeRecordValue, policy?: IListPolicyProps): ListOperation;
        appendItems(bin: string, list: AerospikeRecordValue[], policy?: IListPolicyProps): ListOperation;
        insert(bin: string, index: number, value: AerospikeRecordValue, policy?: IListPolicyProps): ListOperation;
        insertItems(bin: string, index: number, list: AerospikeRecordValue[], policy?: IListPolicyProps): ListOperation;
        pop(bin: string, index: number): ListOperation;
        popRange(bin: string, index: number, count?: number): ListOperation;
        remove(bin: string, index: number): ListOperation;
        removeRange(bin: string, index: number, count?: number): ListOperation;
        removeByIndex(bin: string, index: number, returnType?: ListReturnType): ListOperation;
        removeByIndexRange(bin: string, index: number, count?: number, returnType?: ListReturnType): InvertibleListOp;
        removeByValue(bin: string, value: AerospikeRecordValue, returnType?: ListReturnType): InvertibleListOp;
        removeByValueList(bin: string, values: AerospikeRecordValue[], returnType?: ListReturnType): InvertibleListOp;
        removeByValueRange(bin: string, begin: number | null, end: number | null, returnType?: ListReturnType): InvertibleListOp;
        removeByValueRelRankRange(bin: string, value: number, rank: number, count?: number, returnType?: ListReturnType): InvertibleListOp;
        removeByRank(bin: string, rank: number, returnType?: ListReturnType): ListOperation;
        removeByRankRange(bin: string, rank: number, count?: number, returnType?: ListReturnType): InvertibleListOp;
        clear(bin: string): ListOperation;
        create(bin: string, order: ListOrder, pad?: boolean, persistIndex?: boolean, ctx?: CdtContext): ListOperation;
        set(bin: string, index: number, value: AerospikeRecordValue, policy?: IListPolicyProps): ListOperation;
        trim(bin: string, index: number, count: number): ListOperation;
        get(bin: string, index: number): ListOperation;
        getRange(bin: string, index: number, count?: number): ListOperation;
        getByIndex(bin: string, index: number, returnType?: ListReturnType): ListOperation;
        getByIndexRange(bin: string, index: number, count?: number, returnType?: ListReturnType): InvertibleListOp;
        getByValue(bin: string, value: AerospikeRecordValue, returnType?: ListReturnType): InvertibleListOp;
        getByValueList(bin: string, values: AerospikeRecordValue[], returnType?: ListReturnType): InvertibleListOp;
        getByValueRange(bin: string, begin: number | null, end: number | null, returnType?: ListReturnType): InvertibleListOp;
        getByValueRelRankRange(bin: string, value: number, rank: number, count?: number, returnType?: ListReturnType): InvertibleListOp;
        getByRank(bin: string, rank: number, returnType?: ListReturnType): ListOperation;
        getByRankRange(bin: string, rank: number, count?: number, returnType?: ListReturnType): InvertibleListOp;
        increment(bin: string, index: number, value?: number, policy?: IListPolicyProps): ListOperation;
        size(bin: string): ListOperation;
    }

    export interface MapsModule {
        order: typeof MapsOrder;
        writeMode: typeof MapsWriteMode;
        writeFlags: typeof MapsWriteFlags;
        returnType: typeof MapReturnType;
        MapPolicy: typeof MapPolicy;
        setPolicy(bin: string, policy: IMapPolicyProps): MapOperation;
        put(bin: string, key: string, value: AerospikeRecordValue, policy?: IMapPolicyProps): MapOperation;
        putItems(bin: string, items: AerospikeBins, policy?: IMapPolicyProps): MapOperation;
        increment(bin: string, key: string, incr?: number, policy?: IMapPolicyProps): MapOperation;
        decrement(bin: string, key: string, decr: number, policy?: IMapPolicyProps): MapOperation;
        clear(bin: string): MapOperation;
        removeByKey(bin: string, key: string, returnType?: MapReturnType): MapOperation;
        removeByKeyList(bin: string, keys: string[], returnType?: MapReturnType): MapOperation;
        removeByKeyRange(bin: string, begin: string | null, end: string | null, returnType?: MapReturnType): MapOperation;
        removeByKeyRelIndexRange(bin: string, key: string, index: number, count?: number, returnType?: MapReturnType): MapOperation;
        removeByValue(bin: string, value: AerospikeRecordValue, returnType?: MapReturnType): MapOperation;
        removeByValueList(bin: string, values: AerospikeRecordValue[], returnType?: MapReturnType): MapOperation;
        removeByValueRange(bin: string, begin: number | null, end: number | null, returnType?: MapReturnType): MapOperation;
        removeByValueRelRankRange(bin: string, value: number, rank: number, count?: number, returnType?: MapReturnType): MapOperation;
        removeByIndex(bin: string, index: number, returnType?: MapReturnType): MapOperation;
        removeByIndexRange(bin: string, index: number, count?: number, returnType?: MapReturnType): MapOperation;
        removeByRank(bin: string, rank: number, returnType?: MapReturnType): MapOperation;
        removeByRankRange(bin: string, rank: number, count?: number, returnType?: MapReturnType): MapOperation;
        size(bin: string): MapOperation;
        getByKey(bin: string, key: string, returnType?: MapReturnType): MapOperation;
        getByKeyRange(bin: string, begin: string | null, end: string | null, returnType?: MapReturnType): MapOperation;
        getByKeyRelIndexRange(bin: string, key: string, index: number, count?: number, returnType?: MapReturnType): MapOperation;
        getByValue(bin: string, value: AerospikeRecordValue, returnType?: MapReturnType): MapOperation;
        getByValueRange(bin: string, begin: number | null, end: number | null, returnType?: MapReturnType): MapOperation;
        getByValueRelRankRange(bin: string, value: number, rank: number, count?: number, returnType?: MapReturnType): MapOperation;
        getByIndex(bin: string, index: number, returnType?: MapReturnType): MapOperation;
        getByIndexRange(bin: string, index: number, count?: number, returnType?: MapReturnType): MapOperation;
        getByRank(bin: string, rank: number, returnType?: MapReturnType): MapOperation;
        getByRankRange(bin: string, rank: number, count?: number, returnType?: MapReturnType): MapOperation;
        create(bin: string, order: number, persistIndex?: boolean, ctx?: CdtContext | Function): MapOperation;
    }

    export interface BitwiseModule {
        writeFlags: typeof BitwiseWriteFlags;
        resizeFlags: typeof BitwiseResizeFlags;
        overflow: typeof BitwiseOverflow;
        resize(bin: string, size: number, flags?: BitwiseResizeFlags): BitwiseOperation;
        insert(bin: string, byteOffset: number, value: Buffer): BitwiseOperation;
        remove(bin: string, byteOffset: number, byteSize: number): BitwiseOperation;
        set(bin: string, bitOffset: number, bitSize: number, value: number | Buffer): BitwiseOperation;
        or(bin: string, bitOffset: number, bitSize: number, value: Buffer): BitwiseOperation;
        xor(bin: string, bitOffset: number, bitSize: number, value: Buffer): BitwiseOperation;
        and(bin: string, bitOffset: number, bitSize: number, value: Buffer): BitwiseOperation;
        not(bin: string, bitOffset: number, bitSize: number): BitwiseOperation;
        lshift(bin: string, bitOffset: number, bitSize: string, shift: number): BitwiseOperation;
        rshift(bin: string, bitOffset: number, bitSize: string, shift: number): BitwiseOperation;
        add(bin: string, bitOffset: number, bitSize: number, value: number, sign: boolean): OverflowableBitwiseOp;
        subtract(bin: string, bitOffset: number, bitSize: number, value: number, sign: boolean): OverflowableBitwiseOp;
        get(bin: string, bitOffset: number, bitSize: number): BitwiseOperation;
        getInt(bin: string, bitOffset: number, bitSize: number, sign: boolean): BitwiseOperation;
        lscan(bin: string, bitOffset: number, bitSize: number, value: boolean): BitwiseOperation;
        rscan(bin: string, bitOffset: number, bitSize: number, value: boolean): BitwiseOperation;
    }

    export interface InfoModule {
        parse(info: string): Record<string, any>;
        separators: Record<string, string[]>;
    }

    export interface CdtModule {
        Context: typeof CdtContext;
    }

    type AnyPolicy = BasePolicy | ApplyPolicy | BatchPolicy | OperatePolicy | QueryPolicy | ReadPolicy | RemovePolicy | ScanPolicy | WritePolicy | BatchReadPolicy | BatchRemovePolicy | BatchWritePolicy | BatchApplyPolicy | CommandQueuePolicy | HLLPolicy | InfoPolicy | AdminPolicy | ListPolicy | MapPolicy;

    export interface PolicyModule {
        gen: typeof PolicyGen;
        exists: typeof PolicyExists;
        replica: typeof PolicyReplica;
        readModeAP: typeof PolicyReadModeAP;
        readModeSC: typeof PolicyReadModeSC;
        commitLevel: typeof PolicyCommitLevel;
        ApplyPolicy: typeof ApplyPolicy;
        BatchPolicy: typeof BatchPolicy;
        BatchApplyPolicy: typeof BatchApplyPolicy;
        BatchReadPolicy: typeof BatchReadPolicy;
        BatchRemovePolicy: typeof BatchRemovePolicy;
        BatchWritePolicy: typeof BatchWritePolicy;
        CommandQueuePolicy: typeof CommandQueuePolicy;
        InfoPolicy: typeof InfoPolicy;
        AdminPolicy: typeof AdminPolicy;
        ListPolicy: typeof ListPolicy;
        MapPolicy: typeof MapPolicy;
        OperatePolicy: typeof OperatePolicy;
        QueryPolicy: typeof QueryPolicy;
        ReadPolicy: typeof ReadPolicy;
        RemovePolicy: typeof RemovePolicy;
        ScanPolicy: typeof ScanPolicy;
        WritePolicy: typeof WritePolicy;
        createPolicy(type: string, values: AnyPolicy | Record<string, any>): AnyPolicy;
    }

    export interface StatusModule {
        ERR_ASYNC_QUEUE_FULL: Status;
        ERR_CONNECTION: Status;
        ERR_INVALID_NODE: Status,
        ERR_NO_MORE_CONNECTIONS: Status;
        ERR_ASYNC_CONNECTION: Status;
        ERR_CLIENT_ABORT: Status;
        ERR_INVALID_HOST: Status;
        NO_MORE_RECORDS: Status;
        ERR_PARAM: Status;
        OK: Status;
        ERR_SERVER: Status;
        ERR_RECORD_NOT_FOUND: Status;
        ERR_RECORD_GENERATION: Status;
        ERR_REQUEST_INVALID: Status;
        ERR_RECORD_EXISTS: Status;
        ERR_BIN_EXISTS: Status;
        ERR_CLUSTER_CHANGE: Status;
        ERR_SERVER_FULL: Status;
        ERR_TIMEOUT: Status;
        ERR_ALWAYS_FORBIDDEN: Status;
        ERR_CLUSTER: Status;
        ERR_BIN_INCOMPATIBLE_TYPE: Status;
        ERR_RECORD_TOO_BIG: Status;
        ERR_RECORD_BUSY: Status;
        ERR_SCAN_ABORTED: Status;
        ERR_UNSUPPORTED_FEATURE: Status;
        ERR_BIN_NOT_FOUND: Status;
        ERR_DEVICE_OVERLOAD: Status;
        ERR_RECORD_KEY_MISMATCH: Status;
        ERR_NAMESPACE_NOT_FOUND: Status;
        ERR_BIN_NAME: Status;
        ERR_FAIL_FORBIDDEN: Status;
        ERR_FAIL_ELEMENT_NOT_FOUND: Status;
        ERR_FAIL_ELEMENT_EXISTS: Status;
        ERR_ENTERPRISE_ONLY: Status;
        // TODO: Remove ERR_FAIL_ENTERPRISE_ONLY - referring to lib/status.js#252
        ERR_FAIL_ENTERPRISE_ONLY: Status;
        ERR_OP_NOT_APPLICABLE: Status;
        FILTERED_OUT: Status;
        LOST_CONFLICT: Status;
        QUERY_END: Status;
        SECURITY_NOT_SUPPORTED: Status;
        SECURITY_NOT_ENABLED: Status;
        SECURITY_SCHEME_NOT_SUPPORTED: Status;
        INVALID_COMMAND: Status;
        INVALID_FIELD: Status;
        ILLEGAL_STATE: Status;
        INVALID_USER: Status;
        USER_ALREADY_EXISTS: Status;
        INVALID_PASSWORD: Status;
        EXPIRED_PASSWORD: Status;
        FORBIDDEN_PASSWORD: Status;
        INVALID_CREDENTIAL: Status;
        INVALID_ROLE: Status;
        ROLE_ALREADY_EXISTS: Status;
        INVALID_PRIVILEGE: Status;
        INVALID_WHITELIST: Status;
        QUOTAS_NOT_ENABLED: Status;
        INVALID_QUOTA: Status;
        NOT_AUTHENTICATED: Status;
        ROLE_VIOLATION: Status;
        ERR_UDF: Status;
        ERR_BATCH_DISABLED: Status;
        ERR_BATCH_MAX_REQUESTS_EXCEEDED: Status;
        ERR_BATCH_QUEUES_FULL: Status;
        ERR_GEO_INVALID_GEOJSON: Status;
        ERR_INDEX_FOUND: Status;
        ERR_INDEX_NOT_FOUND: Status;
        ERR_INDEX_OOM: Status;
        ERR_INDEX_NOT_READABLE: Status;
        ERR_INDEX: Status;
        ERR_INDEX_NAME_MAXLEN: Status;
        ERR_INDEX_MAXCOUNT: Status;
        ERR_QUERY_ABORTED: Status;
        ERR_QUERY_QUEUE_FULL: Status;
        ERR_QUERY_TIMEOUT: Status;
        ERR_QUERY: Status;
        ERR_UDF_NOT_FOUND: Status;
        ERR_LUA_FILE_NOT_FOUND: Status;
        BATCH_FAILED: Status;
        AEROSPIKE_BATCH_FAILED: Status;
        NO_RESPONSE: Status;
        AEROSPIKE_NO_RESPONSE: Status;
        MAX_ERROR_RATE: Status;
        AEROSPIKE_MAX_ERROR_RATE: Status;
        USE_NORMAL_RETRY: Status;
        AEROSPIKE_USE_NORMAL_RETRY: Status;
        ERR_MAX_RETRIES_EXCEEDED: Status;
        AEROSPIKE_ERR_MAX_RETRIES_EXCEEDED: Status;
        getMessage(code: Status): string;
    }

    export interface HLLModule {
        writeFlags: typeof HLLWriteFlags;
        init(bin: string, indexBits: number, minhashBits: number): HLLOperation;
        add(bin: string, list: AerospikeRecordValue[], indexBits?: number, minhashBits?: number): HLLOperation;
        setUnion(bin: string, list: AerospikeRecordValue[]): HLLOperation;
        refreshCount(bin: string): HLLOperation;
        fold(bin: string, indexBits: number): HLLOperation;
        getCount(bin: string): HLLOperation;
        getUnion(bin: string, list: AerospikeRecordValue[]): HLLOperation;
        getUnionCount(bin: string, list: AerospikeRecordValue[]): HLLOperation;
        getIntersectCount(bin: string, list: AerospikeRecordValue[]);
        getSimilarity(bin: string, list: AerospikeRecordValue[]): HLLOperation;
        describe(bin: string): HLLOperation;
    }

    interface FeaturesModule {
        CDT_MAP: string;
        CDT_LIST: string;
        BLOB_BITS: string;
    }

    interface OperationsModule {
        Operation: typeof Operation;
        read(bin: string): Operation;
        write(bin: string, value: AerospikeRecordValue): WriteOperation;
        add(bin: string, value: number | Double): AddOperation;
        incr(bin: string, value: number | Double): AddOperation;
        append(bin: string, value: string | Buffer): AppendOperation;
        prepend(bin: string, value: string | Buffer): PrependOperation;
        touch(ttl: number): TouchOperation;
        delete(): Operation;
    }

    interface ExpOperationsModule {
        ExpOperation: typeof ExpOperation;
        read: (bin: string, exp: AerospikeExp, flags?: number) => ExpOperation;
        write: (bin: string, value: AerospikeExp, flags?: number) => ExpOperation;
    }

    type _valueExp<T> = (value: T) => AerospikeExp;
    type _keyTypeExp = () => AerospikeExp;
    type _binTypeExp = (binName: string) => AerospikeExp;
    type _metaExp = () => AerospikeExp;
    type _cmpExp = (left: AerospikeExp, right: AerospikeExp) => AerospikeExp;
    type _VAExp = (...expr: AerospikeExp[]) => AerospikeExp;

    interface ExpModule {
        bool: _valueExp<boolean>;
        int: _valueExp<number>;
        uint: _valueExp<number>;
        float: _valueExp<number>;
        str: _valueExp<string>;
        bytes: (value: string[], size: number) => AerospikeExp;
        geo: _valueExp<GeoJSON>;
        nil: () => AerospikeExp;
        inf:() => AerospikeExp;
        wildcard: () => AerospikeExp;
        list: _valueExp<AerospikeRecordValue[]>;
        map: _valueExp<Record<string, AerospikeRecordValue>>;

        keyInt: _keyTypeExp;
        keyStr: _keyTypeExp;
        keyBlob: _keyTypeExp;
        keyExists: _keyTypeExp;
        
        binBool: _binTypeExp;
        binInt: _binTypeExp;
        binFloat: _binTypeExp;
        binStr: _binTypeExp;
        binBlob: _binTypeExp;
        binGeo: _binTypeExp;
        binList: _binTypeExp;
        binMap: _binTypeExp;
        binHll: _binTypeExp;
        binType: _binTypeExp;
        binExists: _binTypeExp;

        setName: _metaExp;
        deviceSize: _metaExp;
        lastUpdate: _metaExp;
        sinceUpdate: _metaExp;
        voidTime: _metaExp;
        ttl: _metaExp;
        isTombstone: _metaExp;
        memorySize: _metaExp;
        recordSize: _metaExp;
        digestModulo: _metaExp;

        eq: _cmpExp;
        ne: _cmpExp;
        gt: _cmpExp;
        ge: _cmpExp;
        lt: _cmpExp;
        le: _cmpExp;
        cmpRegex: (options: regex, regex: string, cmpStr: AerospikeExp) => AerospikeExp;
        cmpGeo: _cmpExp;

        not: (expr: AerospikeExp) => AerospikeExp;
        and: _VAExp;
        or: _VAExp;
        exclusive: _VAExp;

        add: _VAExp;
        sub: _VAExp;
        mul: _VAExp;
        div: _VAExp;
        pow: _VAExp;
        log: _VAExp;
        mod: _VAExp;
        abs: _VAExp;
        floor: _VAExp;
        ceil: _VAExp;
        toInt: _VAExp;
        toFloat: _VAExp;
        intAnd: _VAExp;
        intOr: _VAExp;
        intXor: _VAExp;
        intNot: _VAExp;
        intLshift: _VAExp;
        intRshift: _VAExp;
        intArshift: _VAExp;
        intCount: _VAExp;
        intLscan: _VAExp;
        intRscan: _VAExp;
        min: _VAExp;
        max: _VAExp;
        cond: _VAExp;
        let: _VAExp;
        def: (varName: string, expr: AerospikeExp) => AerospikeExp;
        var: (varName: string) => AerospikeExp;
        lists: {
            size: (bin: AerospikeExp, ctx?: CdtContext) => AerospikeExp,
            getByValue: (bin: AerospikeExp, value: AerospikeExp, returnType: ListReturnType, ctx?: CdtContext) => AerospikeExp,
            getByValueRange: (bin: AerospikeExp, begin: AerospikeExp, end: AerospikeExp, returnType: ListReturnType, ctx?: CdtContext) => AerospikeExp,
            getByValueList: (bin: AerospikeExp, value: AerospikeExp, returnType: ListReturnType, ctx?: CdtContext) => AerospikeExp,
            getByRelRankRangeToEnd: (bin: AerospikeExp, value: AerospikeExp, rank: AerospikeExp, returnType: ListReturnType, ctx?: CdtContext) => AerospikeExp,
            getByRelRankRange: (bin: AerospikeExp, value: AerospikeExp, rank: AerospikeExp, count: AerospikeExp, returnType: ListReturnType, ctx?: CdtContext) => AerospikeExp,
            getByIndex: (bin: AerospikeExp, index: AerospikeExp, valueType: AerospikeExp, returnType: ListReturnType, ctx?: CdtContext) => AerospikeExp,
            getByIndexRangeToEnd: (bin: AerospikeExp, index: AerospikeExp, returnType: ListReturnType, ctx?: CdtContext) => AerospikeExp,
            getByIndexRange: (bin: AerospikeExp, index: AerospikeExp, count: AerospikeExp, returnType: ListReturnType, ctx?: CdtContext) => AerospikeExp,
            getByRank: (bin: AerospikeExp, rank: AerospikeExp, valueType: AerospikeExp, returnType: ListReturnType, ctx?: CdtContext) => AerospikeExp,
            getByRankRangeToEnd: (bin: AerospikeExp, rank: AerospikeExp, returnType: ListReturnType, ctx?: CdtContext) => AerospikeExp,
            getByRankRange: (bin: AerospikeExp, rank: AerospikeExp, count: AerospikeExp, returnType: ListReturnType, ctx?: CdtContext) => AerospikeExp,
            append: (bin: AerospikeExp, value: AerospikeExp, policy?: IListPolicyProps, ctx?: CdtContext) => AerospikeExp,
            appendItems: (bin: AerospikeExp, value: AerospikeExp, policy?: IListPolicyProps, ctx?: CdtContext) => AerospikeExp,
            insert: (bin: AerospikeExp, value: AerospikeExp, idx: AerospikeExp, policy?: IListPolicyProps, ctx?: CdtContext) => AerospikeExp,
            insertItems: (bin: AerospikeExp, value: AerospikeExp, idx: AerospikeExp, policy?: IListPolicyProps, ctx?: CdtContext) => AerospikeExp,
            increment: (bin: AerospikeExp, value: AerospikeExp, idx: AerospikeExp, policy?: IListPolicyProps, ctx?: CdtContext) => AerospikeExp,
            set: (bin: AerospikeExp, value: AerospikeExp, idx: AerospikeExp, policy?: IListPolicyProps, ctx?: CdtContext) => AerospikeExp,
            clear: (bin: AerospikeExp, ctx?: CdtContext) => AerospikeExp,
            sort: (bin: AerospikeExp, order: ListSortFlags, ctx?: CdtContext) => AerospikeExp,
            removeByValue: (bin: AerospikeExp, value: AerospikeExp, ctx?: CdtContext, returnType?: ListReturnType) => AerospikeExp,
            removeByValueList: (bin: AerospikeExp, values: AerospikeExp, ctx?: CdtContext, returnType?: ListReturnType) => AerospikeExp,
            removeByValueRange: (bin: AerospikeExp, end: AerospikeExp, begin: AerospikeExp, ctx?: CdtContext, returnType?: ListReturnType) => AerospikeExp,
            removeByRelRankRangeToEnd: (bin: AerospikeExp, rank: AerospikeExp, value: AerospikeExp, ctx?: CdtContext, returnType?: ListReturnType) => AerospikeExp,
            removeByRelRankRange: (bin: AerospikeExp, count: AerospikeExp, rank: AerospikeExp, value: AerospikeExp, ctx?: CdtContext, returnType?: ListReturnType) => AerospikeExp,
            removeByIndex: (bin: AerospikeExp, idx: AerospikeExp, ctx?: CdtContext, returnType?: ListReturnType) => AerospikeExp,
            removeByIndexRangeToEnd: (bin: AerospikeExp, idx: AerospikeExp, ctx?: CdtContext, returnType?: ListReturnType) => AerospikeExp,
            removeByIndexRange: (bin: AerospikeExp, count: AerospikeExp, idx: AerospikeExp, ctx?: CdtContext, returnType?: ListReturnType) => AerospikeExp,
            removeByRank: (bin: AerospikeExp, rank: AerospikeExp, ctx?: CdtContext, returnType?: ListReturnType) => AerospikeExp,
            removeByRankRangeToEnd: (bin: AerospikeExp, rank: AerospikeExp, ctx?: CdtContext, returnType?: ListReturnType) => AerospikeExp,
            removeByRankRange: (bin: AerospikeExp, count: AerospikeExp, rank: AerospikeExp, ctx?: CdtContext, returnType?: ListReturnType) => AerospikeExp
        };
        maps: {
            put: (bin: AerospikeExp, value: AerospikeExp, key: AerospikeExp, policy?: IMapPolicyProps, ctx?: CdtContext) => AerospikeExp,
            putItems: (bin: AerospikeExp, map: AerospikeExp, policy?: IMapPolicyProps, ctx?: CdtContext) => AerospikeExp,
            increment: (bin: AerospikeExp, value: AerospikeExp, key: AerospikeExp, policy?: IMapPolicyProps, ctx?: CdtContext) => AerospikeExp,
            clear: (bin: AerospikeExp, ctx?: CdtContext) => AerospikeExp,
            removeByKey: (bin: AerospikeExp, key: AerospikeExp, ctx?: CdtContext, returnType?: MapReturnType) => AerospikeExp,
            removeByKeyList: (bin: AerospikeExp, keys: AerospikeExp, ctx?: CdtContext, returnType?: MapReturnType) => AerospikeExp,
            removeByKeyRange: (bin: AerospikeExp, end: AerospikeExp, begin: AerospikeExp, ctx?: CdtContext, returnType?: MapReturnType) => AerospikeExp,
            removeByKeyRelIndexRangeToEnd: (bin: AerospikeExp, idx: AerospikeExp, key: AerospikeExp, ctx?: CdtContext, returnType?: MapReturnType) => AerospikeExp,
            removeByKeyRelIndexRange: (bin: AerospikeExp, count: AerospikeExp, idx: AerospikeExp, key: AerospikeExp, ctx?: CdtContext, returnType?: MapReturnType) => AerospikeExp,
            removeByValue: (bin: AerospikeExp, value: AerospikeExp, ctx?: CdtContext, returnType?: MapReturnType) => AerospikeExp,
            removeByValueList: (bin: AerospikeExp, values: AerospikeExp, ctx?: CdtContext, returnType?: MapReturnType) => AerospikeExp,
            removeByValueRange: (bin: AerospikeExp, end: AerospikeExp, begin: AerospikeExp, ctx?: CdtContext, returnType?: MapReturnType) => AerospikeExp,
            removeByValueRelRankRangeToEnd: (bin: AerospikeExp, rank: AerospikeExp, value: AerospikeExp, ctx?: CdtContext, returnType?: MapReturnType) => AerospikeExp,
            removeByValueRelRankRange: (bin: AerospikeExp, count: AerospikeExp, rank: AerospikeExp, value: AerospikeExp, key: AerospikeExp, ctx?: CdtContext, returnType?: MapReturnType) => AerospikeExp,
            removeByIndex: (bin: AerospikeExp, idx: AerospikeExp, ctx?: CdtContext, returnType?: MapReturnType) => AerospikeExp,
            removeByIndexRangeToEnd: (bin: AerospikeExp, idx: AerospikeExp, ctx?: CdtContext, returnType?: MapReturnType) => AerospikeExp,
            removeByIndexRange: (bin: AerospikeExp, count: AerospikeExp, idx: AerospikeExp, ctx?: CdtContext, returnType?: MapReturnType) => AerospikeExp,
            removeByRank: (bin: AerospikeExp, rank: AerospikeExp, ctx?: CdtContext, returnType?: MapReturnType) => AerospikeExp,
            removeByRankRangeToEnd: (bin: AerospikeExp, rank: AerospikeExp, ctx?: CdtContext, returnType?: MapReturnType) => AerospikeExp,
            removeByRankRange: (bin: AerospikeExp, count: AerospikeExp, rank: AerospikeExp, ctx?: CdtContext, returnType?: MapReturnType) => AerospikeExp,
            size: (bin: AerospikeExp, ctx?: CdtContext) => AerospikeExp,
            getByKey: (bin: AerospikeExp, key: AerospikeExp, valueType: AerospikeExp, returnType: MapReturnType, ctx?: CdtContext) => AerospikeExp,
            getByKeyRange: (bin: AerospikeExp, end: AerospikeExp, begin: AerospikeExp, returnType: MapReturnType, ctx?: CdtContext) => AerospikeExp,
            getByKeyList: (bin: AerospikeExp, keys: AerospikeExp, returnType: MapReturnType, ctx?: CdtContext) => AerospikeExp,
            getByKeyRelIndexRangeToEnd: (bin: AerospikeExp, idx: AerospikeExp, key: AerospikeExp, returnType: MapReturnType, ctx?: CdtContext) => AerospikeExp,
            getByKeyRelIndexRange: (bin: AerospikeExp, count: AerospikeExp, idx: AerospikeExp, key: AerospikeExp, returnType: MapReturnType, ctx?: CdtContext) => AerospikeExp,
            getByValue: (bin: AerospikeExp, value: AerospikeExp, returnType: MapReturnType, ctx?: CdtContext) => AerospikeExp,
            getByValueRange: (bin: AerospikeExp, end: AerospikeExp, begin: AerospikeExp, returnType: MapReturnType, ctx?: CdtContext) => AerospikeExp,
            getByValueList: (bin: AerospikeExp, values: AerospikeExp, returnType: MapReturnType, ctx?: CdtContext) => AerospikeExp,
            getByValueRelRankRangeToEnd: (bin: AerospikeExp, rank: AerospikeExp, value: AerospikeExp, returnType: MapReturnType, ctx?: CdtContext) => AerospikeExp,
            getByValueRelRankRange: (bin: AerospikeExp, count: AerospikeExp, rank: AerospikeExp, value: AerospikeExp, returnType: MapReturnType, ctx?: CdtContext) => AerospikeExp,
            getByIndex: (bin: AerospikeExp, idx: AerospikeExp, valueType: AerospikeExp, returnType: MapReturnType, ctx?: CdtContext) => AerospikeExp,
            getByIndexRangeToEnd: (bin: AerospikeExp, idx: AerospikeExp, returnType: MapReturnType, ctx?: CdtContext) => AerospikeExp,
            getByIndexRange: (bin: AerospikeExp, count: AerospikeExp, idx: AerospikeExp, returnType: MapReturnType, ctx?: CdtContext) => AerospikeExp,
            getByRank: (bin: AerospikeExp, rank: AerospikeExp, valueType: AerospikeExp, returnType: MapReturnType, ctx?: CdtContext) => AerospikeExp,
            getByRankRangeToEnd: (bin: AerospikeExp, rank: AerospikeExp, returnType: MapReturnType, ctx?: CdtContext) => AerospikeExp,
            getByRankRange: (bin: AerospikeExp, count: AerospikeExp, rank: AerospikeExp, returnType: MapReturnType, ctx?: CdtContext) => AerospikeExp
        };
        bit: {
            reSize: (bin: AerospikeExp, flags: BitwiseResizeFlags, byteSize: AerospikeExp, policy?: IBitwisePolicyProps) => AerospikeExp,
            insert: (bin: AerospikeExp, value: AerospikeExp, byteOffset: AerospikeExp, policy?: IBitwisePolicyProps) => AerospikeExp,
            remove: (bin: AerospikeExp, byteSize: AerospikeExp, byteOffset: AerospikeExp, policy?: IBitwisePolicyProps) => AerospikeExp,
            set: (bin: AerospikeExp, value: AerospikeExp, bitSize: AerospikeExp, bitOffset: AerospikeExp, policy?: IBitwisePolicyProps) => AerospikeExp,
            or: (bin: AerospikeExp, value: AerospikeExp, bitSize: AerospikeExp, bitOffset: AerospikeExp, policy?: IBitwisePolicyProps) => AerospikeExp,
            xor: (bin: AerospikeExp, value: AerospikeExp, bitSize: AerospikeExp, bitOffset: AerospikeExp, policy?: IBitwisePolicyProps) => AerospikeExp,
            and: (bin: AerospikeExp, value: AerospikeExp, bitSize: AerospikeExp, bitOffset: AerospikeExp, policy?: IBitwisePolicyProps) => AerospikeExp,
            not: (bin: AerospikeExp, bitSize: AerospikeExp, bitOffset: AerospikeExp, policy?: IBitwisePolicyProps) => AerospikeExp,
            lShift: (bin: AerospikeExp, shift: AerospikeExp, bitSize: AerospikeExp, bitOffset: AerospikeExp, policy?: IBitwisePolicyProps) => AerospikeExp,
            rShift: (bin: AerospikeExp, shift: AerospikeExp, bitSize: AerospikeExp, bitOffset: AerospikeExp, policy?: IBitwisePolicyProps) => AerospikeExp,
            add: (bin: AerospikeExp, action: BitwiseOverflow, value: AerospikeExp, bitSize: AerospikeExp, bitOffset: AerospikeExp, policy?: IBitwisePolicyProps) => AerospikeExp,
            subtract: (bin: AerospikeExp, action: BitwiseOverflow, value: AerospikeExp, bitSize: AerospikeExp, bitOffset: AerospikeExp, policy?: IBitwisePolicyProps) => AerospikeExp,
            setInt: (bin: AerospikeExp, value: AerospikeExp, bitSize: AerospikeExp, bitOffset: AerospikeExp, policy?: IBitwisePolicyProps) => AerospikeExp,
            get: (bin: AerospikeExp, bitSize: AerospikeExp, bitOffset: AerospikeExp) => AerospikeExp,
            count: (bin: AerospikeExp, bitSize: AerospikeExp, bitOffset: AerospikeExp) => AerospikeExp,
            lScan: (bin: AerospikeExp, value: AerospikeExp, bitSize: AerospikeExp, bitOffset: AerospikeExp) => AerospikeExp,
            rScan: (bin: AerospikeExp, value: AerospikeExp, bitSize: AerospikeExp, bitOffset: AerospikeExp) => AerospikeExp,
            getInt: (bin: AerospikeExp, sign: boolean, bitSize: AerospikeExp, bitOffset: AerospikeExp) => AerospikeExp
        };
        hll: {
            initMH: (bin: AerospikeExp, mhBitCount: number, indexBitCount: number, policy?: IHLLPolicyProps) => AerospikeExp,
            init: (bin: AerospikeExp, indexBitCount: number, policy?: IHLLPolicyProps) => AerospikeExp,
            addMH: (bin: AerospikeExp, mhBitCount: number, indexBitCount: number, list: AerospikeExp, policy?: IHLLPolicyProps) => AerospikeExp,
            add: (bin: AerospikeExp, indexBitCount: number, list: AerospikeExp, policy?: IHLLPolicyProps) => AerospikeExp,
            update: (bin: AerospikeExp, list: AerospikeExp, policy?: IHLLPolicyProps) => AerospikeExp,
            getCount: (bin: AerospikeExp) => AerospikeExp,
            getUnion: (bin: AerospikeExp, list: AerospikeExp) => AerospikeExp,
            getUnionCount: (bin: AerospikeExp, list: AerospikeExp) => AerospikeExp,
            getIntersectCount: (bin: AerospikeExp, list: AerospikeExp) => AerospikeExp,
            getSimilarity: (bin: AerospikeExp, list: AerospikeExp) => AerospikeExp,
            describe: (bin: AerospikeExp) => AerospikeExp,
            mayContain: (bin: AerospikeExp, list: AerospikeExp) => AerospikeExp
        },

        expReadFlags: typeof ExpReadFlags;
        expWriteFlags: typeof ExpWriteFlags;

        type: typeof ExpTypes;
        operations: ExpOperationsModule;
    }

    interface ILogInfo {
        level?: LogLevel;
        file?: number;
    }

    interface Commands {
        Apply: typeof ApplyCommand;
        BatchExists: typeof BatchExistsCommand;
        BatchGet: typeof BatchGetCommand;
        BatchRead: typeof BatchReadCommand;
        BatchWrite: typeof BatchWriteCommand;
        BatchApply: typeof BatchApplyCommand;
        BatchRemove: typeof BatchRemoveCommand;
        BatchSelect: typeof BatchSelectCommand;
        Connect: typeof ConnectCommand;
        Exists: typeof ExistsCommand;
        Get: typeof GetCommand;
        IndexCreate: typeof IndexCreateCommand;
        IndexRemove: typeof IndexRemoveCommand;
        InfoAny: typeof InfoAnyCommand;
        InfoForeach: typeof InfoForeachCommand;
        InfoHost: typeof InfoHostCommand;
        InfoNode: typeof InfoNodeCommand;
        JobInfo: typeof JobInfoCommand;
        Operate: typeof OperateCommand;
        Put: typeof PutCommand;
        Query: typeof QueryCommand;
        QueryPages: typeof QueryPagesCommand;
        QueryApply: typeof QueryApplyCommand;
        QueryBackground: typeof QueryBackgroundCommand;
        QueryOperate: typeof QueryOperateCommand;
        QueryForeach: typeof QueryForeachCommand;
        Remove: typeof RemoveCommand;
        Scan: typeof ScanCommand;
        ScanPages: typeof ScanPagesCommand;
        ScanBackground: typeof ScanBackgroundCommand;
        ScanOperate: typeof ScanOperateCommand;
        Select: typeof SelectCommand;
        Truncate: typeof TruncateCommand;
        UdfRegister: typeof UdfRegisterCommand;
        UdfRemove: typeof UdfRemoveCommand;
    }

    export const filter: FilterModule;
    export const exp: ExpModule;
    export enum regex {
        BASIC,
        EXTENDED,
        ICASE,
        NEWLINE
    }
    export const info: InfoModule;
    export const admin: AdminModule;
    export const lists: ListsModule
    export const hll: HLLModule;
    export const maps: MapsModule;
    export const cdt: CdtModule;
    export const bitwise: BitwiseModule;
    export const operations: OperationsModule;
    export const policy: PolicyModule;
    export const status: StatusModule;
    export const features: FeaturesModule;
    export const Record: typeof AerospikeRecord;
    export const auth: typeof Auth;
    export const language: typeof Language;
    export const log: typeof Log;
    export const ttl: typeof TTL;
    export const jobStatus: typeof JobStatus;
    export const indexDataType: typeof IndexDataType;
    export const indexType: typeof IndexType;
    export function print(err: Error, result: any): void;
    export function releaseEventLoop(): void;
    export function client(config: IConfigOptions): Client;
    export function connect(config: IConfigOptions): Promise<Client>;
    export function connect(callback: TypedCallback<Client>): Client;
    export function connect(config: IConfigOptions, callback: TypedCallback<Client>): Client;
    export function connect(config: IConfigOptions): Promise<Client>;
    export function setDefaultLogging(ILogInfo: ILogInfo): void;
    export function setupGlobalCommandQueue(policy: ICommandQueuePolicyProps): void;
    export enum batchType {
        BATCH_READ,
        BATCH_WRITE,
        BATCH_APPLY,
        BATCH_REMOVE
    }
    export const priviledgeCode: typeof PrivilegeCode;
}
