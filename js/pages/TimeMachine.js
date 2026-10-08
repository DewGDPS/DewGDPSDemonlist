export default {
    template: `
        <div class="time-machine">
            <h1>Time Machine</h1>

            <p>Select a version of DewDemonList:</p>

            <div class="versions">
                <button @click="loadVersion('v1.0')">
                    v1.0
                </button>
            </div>

            <div v-if="selectedVersion" class="selected-version">
                <h2>Viewing {{ selectedVersion }}</h2>
                <p>
                    This is the archived version of DewDemonList.
                </p>
            </div>
        </div>
    `,

    data() {
        return {
            selectedVersion: null
        };
    },

    methods: {
        loadVersion(version) {
            this.selectedVersion = version;

            window.location.hash = `/timemachine/${version}`;
        }
    }
};
