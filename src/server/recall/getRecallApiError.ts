export const getRecallApiError = (data: unknown): string => {
    if (typeof data !== 'object' || data === null) {
        return JSON.stringify(data);
    }

    if ('detail' in data) {
        return getSanitizedErrorMessage(data?.detail);
    } else if ('non_field_errors' in data) {
        return getSanitizedErrorMessage(data?.non_field_errors);
    }

    if (typeof data === 'string') {
        return data;
    } else {
        return JSON.stringify(data);
    }
}

const getSanitizedErrorMessage = (data: unknown): string => {
    if (Array.isArray(data)) {
        return data?.join(". ");
    } else if (typeof data === 'string') {
        return sanitizeInvalidJson(data);
    } else {
        return JSON.stringify(data);
    }
}

const sanitizeInvalidJson = (data: string): string => data.replaceAll('"', '').replaceAll("'", '').replaceAll("[", "").replaceAll("]", "");