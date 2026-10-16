import List from './List.js';

export default {
    extends: List,

    data() {
        return {
            ...List.data(),
            dataDir: '/DewGDPSDemonlist/DDLPlus',
        };
    },
};
