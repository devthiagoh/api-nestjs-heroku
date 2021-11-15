export function map(params): Map<string, string> {
    return params ? new Map(JSON.parse(params.toString())) : null;
};

export function json(params){
    let array = Array.of(params);
    return Object.assign(array[0]);
}