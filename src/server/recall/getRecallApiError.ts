// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRecallApiError = (data: any): string => {
    if (data?.detail) {
        return getSanitizedErrorMessage(data);
    } else if (data?.non_field_errors) {
        return getSanitizedErrorMessage(data?.non_field_errors);
    }
    if (typeof data === 'string') {
        return data;
    } else {
        return JSON.stringify(data);
    }
}

const getSanitizedErrorMessage = (data: any): string => {
    if (Array.isArray(data)) {
        return data?.join(". ");
    } else if (typeof data === 'string') {
        return sanitizeInvalidJson(data);
    } else {
        return JSON.stringify(data);
    }
}

const sanitizeInvalidJson = (data: string): string => data.replaceAll('"', '').replaceAll("'", '').replaceAll("[", "").replaceAll("]", "");