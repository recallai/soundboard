export const getRecallApiError = (data: any): string => {
    if (data?.detail) {
        if (Array.isArray(data?.detail)) {
            return data?.detail.join(". ");
        } else if (typeof data?.detail === 'string') {
            return data?.detail.replaceAll('"', '').replaceAll("'", '').replaceAll("[", "").replaceAll("]", "");
        }
    }
    if (typeof data === 'string') {
        return data;
    } else {
        return JSON.stringify(data);
    }
}