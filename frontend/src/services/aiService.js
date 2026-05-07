import { api } from './api';

export const aiService = {
    generateDescription: async (keywords) => {
        const response = await api('/ai/generate-description', {
            method: 'POST',
            body: JSON.stringify({ keywords })
        });
        return response.result;
    },

    enhanceImage: async () => {
        const response = await api('/ai/enhance-image', {
            method: 'POST'
        });
        return response.results;
    },

    translateCatalog: async () => {
        const response = await api('/ai/translate-catalog', {
            method: 'POST'
        });
        return response.translations;
    },

    verifyDomain: async (domain) => {
        return await api('/ai/verify-domain', {
            method: 'POST',
            body: JSON.stringify({ domain })
        });
    }
};

export default aiService;
