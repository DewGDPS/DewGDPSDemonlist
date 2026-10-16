import List from './List.js';

export default {
    ...List,

    data() {
        return {
            ...List.data(),
            dataDir: '/DewGDPSDemonlist/DDLPlus',
        };
    },
};
