export default {
    template: `
        <div class="time-machine">
            <h1>Time Machine</h1>

            <p>Select a version of DewDemonList:</p>

            <div class="versions">
                <button @click="loadVersion('v1.0')">
                    v1.0
                </button>

                <button @click="loadVersion('v1.1')">
                    v1.1
                </button>
            </div>

            <div v-if="loading">
                Loading historical version...
            </div>

            <div v-if="error" class="error">
                {{ error }}
            </div>

            <div v-if="levels.length > 0">
                <h2>{{ selectedVersion }}</h2>

                <ol>
                    <li v-for="level in levels" :key="level.id">
                        {{ level.name }}
                    </li>
                </ol>
            </div>
        </div>
    `,

    data() {
        return {
            selectedVersion: null,
            levels: [],
            loading: false,
            error: null
        };
    },

    methods: {
        async loadVersion(version) {
            this.selectedVersion = version;
            this.levels = [];
            this.error = null;
            this.loading = true;

            try {
                const dir = `/DewGDPSDemonlist/TimeMachine/${version}/data`;

                const listResult = await fetch(`${dir}/_list.json`);

                if (!listResult.ok) {
                    throw new Error(`Could not find ${version}/_list.json`);
                }

                const list = await listResult.json();

                const levels = await Promise.all(
                    list.map(async (path) => {
                        const result = await fetch(`${dir}/${path}.json`);

                        if (!result.ok) {
                            throw new Error(`Could not load ${path}.json`);
                        }

                        return await result.json();
                    })
                );

                this.levels = levels;
            } catch (error) {
                console.error(error);
                this.error = `Failed to load ${version}.`;
            } finally {
                this.loading = false;
            }
        }
    }
};
