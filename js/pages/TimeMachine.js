import { store } from "../main.js";
import { embed } from "../util.js";
import { score } from "../score.js";
import { fetchList } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

export default {
    components: { Spinner, LevelAuthors },

    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>

        <main v-else class="page-list">

            <!-- TIME MACHINE VERSION SELECTOR -->
            <div class="timemachine-header">
                <h1>Time Machine</h1>

                <div class="timemachine-buttons">
                    <button
                        v-for="version in versions"
                        @click="changeVersion(version)"
                        :class="{ active: selectedVersion === version }"
                    >
                        {{ version }}
                    </button>
                </div>
            </div>

            <!-- LEVEL LIST -->
            <div class="list-container">
                <table class="list" v-if="list">
                    <tr v-for="([level, err], i) in list">
                        <td class="rank">
                            <p v-if="i + 1 <= 150" class="type-label-lg">
                                #{{ i + 1 }}
                            </p>
                            <p v-else class="type-label-lg">
                                Legacy
                            </p>
                        </td>

                        <td
                            class="level"
                            :class="{
                                'active': selected === i,
                                'error': !level
                            }"
                        >
                            <button @click="selected = i">
                                <span class="type-label-lg">
                                    {{ level?.name || \`Error (\${err}.json)\` }}
                                </span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- LEVEL INFORMATION -->
            <div class="level-container">

                <div class="level" v-if="level">

                    <h1>{{ level.name }}</h1>

                    <LevelAuthors
                        :author="level.author"
                        :creators="level.creators"
                        :verifier="level.verifier"
                    ></LevelAuthors>

                    <iframe
                        class="video"
                        id="videoframe"
                        :src="video"
                        frameborder="0"
                    ></iframe>

                    <ul class="stats">

                        <li>
                            <div class="type-title-sm">
                                Points when completed
                            </div>
                            <p>
                                {{ score(selected + 1, 100, level.percentToQualify) }}
                            </p>
                        </li>

                        <li>
                            <div class="type-title-sm">
                                ID
                            </div>
                            <p>{{ level.id }}</p>
                        </li>

                        <li>
                            <div class="type-title-sm">
                                Enjoyment Rating
                            </div>
                            <p>{{ level.enjoyment || 'Not Rated' }}</p>
                        </li>

                        <li>
                            <div class="type-title-sm">
                                Password
                            </div>
                            <p>{{ level.password || 'Free to Copy' }}</p>
                        </li>

                    </ul>

                    <h2>Records</h2>

                    <p v-if="selected + 1 <= 75">
                        <strong>{{ level.percentToQualify }}%</strong>
                        or better to qualify
                    </p>

                    <p v-else-if="selected + 1 <= 150">
                        <strong>100%</strong>
                        or better to qualify
                    </p>

                    <p v-else>
                        This level does not accept new records.
                    </p>

                    <table class="records">

                        <tr
                            v-for="record in level.records"
                            class="record"
                        >

                            <td class="percent">
                                <p>{{ record.percent }}%</p>
                            </td>

                            <td class="user">
                                <a
                                    :href="record.link"
                                    target="_blank"
                                    class="type-label-lg"
                                >
                                    {{ record.user }}
                                </a>
                            </td>

                            <td class="mobile">
                                <img
                                    v-if="record.mobile"
                                    :src="'/DewGDPSDemonlist/assets/phone-landscape' + (store.dark ? '-dark' : '') + '.svg'"
                                    alt="Mobile"
                                >
                            </td>

                            <td class="hz">
                                <p>{{ record.hz }}Hz</p>
                            </td>

                        </tr>

                    </table>

                </div>

                <div
                    v-else
                    class="level"
                    style="height: 100%; justify-content: center; align-items: center;"
                >
                    <p>(ノಠ益ಠ)ノ彡┻━┻</p>
                </div>

            </div>

        </main>
    `,

    data: () => ({
        list: [],
        loading: true,
        selected: 0,
        selectedVersion: "v1.0",

        store,

        versions: [
            "v1.0",
            "v1.1"
        ]
    }),

    computed: {

        level() {
            return this.list[this.selected]?.[0] ?? null;
        },

        video() {

            if (!this.level) {
                return "";
            }

            return embed(this.level.verification);
        }

    },

    async mounted() {
        await this.loadVersion(this.selectedVersion);
    },

    methods: {

        embed,
        score,

        async loadVersion(version) {

            this.loading = true;

            this.selected = 0;

            const dir =
                `/DewGDPSDemonlist/TimeMachine/${version}/data`;

            this.list = (await fetchList(dir)) ?? [];

            this.loading = false;
        },

        async changeVersion(version) {

            this.selectedVersion = version;

            await this.loadVersion(version);

        }

    }
};
