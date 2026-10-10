import { store } from "../main.js";
import { embed } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchList } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <table class="list" v-if="list">
                    <tr v-for="([level, err], i) in list">
                        <td class="rank">
                            <p v-if="i + 1 <= 150" class="type-label-lg">#{{ i + 1 }}</p>
                            <p v-else class="type-label-lg">Legacy</p>
                        </td>
                        <td class="level" :class="{ 'active': selected == i, 'error': !level }">
                            <button @click="selected = i">
                                <span class="type-label-lg">{{ level?.name || \`Error (\${err}.json)\` }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="level-container">
                <div class="level" v-if="level">
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
                    <iframe class="video" id="videoframe" :src="video" frameborder="0"></iframe>
                    <ul class="stats">
    <li>
        <div class="type-title-sm">Points when completed</div>
        <p>{{ score(selected + 1, 100, level.percentToQualify) }}</p>
    </li>
    <li>
        <div class="type-title-sm">ID</div>
        <p>{{ level.id }}</p>
    </li>
    <li>
        <div class="type-title-sm">Enjoyment Rating</div>
        <p>{{ level.enjoyment || 'Not Rated' }}</p>
    </li>
    <li>
        <div class="type-title-sm">Password</div>
        <p>{{ level.password || 'Free to Copy' }}</p>
    </li>
</ul>
                    <h2>Records ({{ level.records.length }})</h2>
                    <p v-if="selected + 1 <= 75"><strong>{{ level.percentToQualify }}%</strong> or better to qualify</p>
                    <p v-else-if="selected +1 <= 150"><strong>100%</strong> or better to qualify</p>
                    <p v-else>This level does not accept new records.</p>
                    <table class="records">
                        <tr v-for="record in level.records" class="record">
                            <td class="percent">
                                <p>{{ record.percent }}%</p>
                            </td>
                            <td class="user">
                                <a :href="record.link" target="_blank" class="type-label-lg">{{ record.user }}</a>
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
                <div v-else class="level" style="height: 100%; justify-content: center; align-items: center;">
                    <p>(ノಠ益ಠ)ノ彡┻━┻</p>
                </div>
            </div>
            <div class="meta-container">
                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors">{{ error }}</p>
                    </div>
                    <div class="og">
                        <p class="type-label-md">Credit to Prometheus for the <a href="https://tsl.pages.dev/" target="_blank">Website layout</a></p>
                    </div>
                    <template v-if="editors">
    <h3>List Editors</h3>
    <ol class="editors">
        <li v-for="editor in editors">        
<img
    :src="'/DewGDPSDemonlist/assets/' + editor.image.replace('.svg', (store.dark ? '-dark' : '') + '.svg')"
    :alt="editor.name"
    width="24"
    height="24"
    style="object-fit: contain;"
>
            <a
                v-if="editor.link"
                class="type-label-lg link"
                target="_blank"
                :href="editor.link"
            >{{ editor.name }}</a>
            <p v-else>{{ editor.name }}</p>
        </li>
    </ol>
</template>
                    <h3>Submission Requirements</h3>
                    <p>
                        1. No Hacks Allowed (Except for FPS Bypass, but only up to 360 FPS)
                    </p>
                    <p>
                        2. Must be a Rated Level on the GDPS
                    </p>
                    <p>
                        3. Clicks must be heard and sync with the video (Use a CPS Counter that flashes green to prove it easier)
                    </p>
                    <p>
                        4. The recording must show the previous attempt death, unless the completion is on the first attempt, then show Any Death with No edits (Like Replay the Level and instantly Die)
                    </p>
                    <p>
                        5. The Recording Must show the player hit the End Wall or End Trigger
                    </p>
                    <p>
                        6. No Secret Ways (Swag Routes are allowed to a degree)
                    </p>
                    <p>
                        7. Must be the Original Version of the Level, no modifications. (Personal copies are ONLY allowed for startpos)
                    </p>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        loading: true,
        selected: 0,
        errors: [],
        store
    }),
    computed: {
        level() {
    return this.list[this.selected]?.[0] ?? null;
},
        video() {
    if (!this.level) {
        return "";
    }

    if (!this.level.showcase) {
        return embed(this.level.verification);
    }

    return embed(
        this.toggledShowcase
            ? this.level.showcase
            : this.level.verification
    );
},
    },
    async mounted() {
        // Hide loading spinner
        this.list = (await fetchList()) ?? [];
        this.editors = await fetchEditors();

        // Error handling
        if (!this.list) {
            this.errors = [
                "Failed to load list. Retry in a few minutes or notify list staff.",
            ];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => {
                        return `Failed to load level. (${err}.json)`;
                    })
            );
            if (!this.editors) {
                this.errors.push("Failed to load list editors.");
            }
        }

        this.loading = false;
    },
    methods: {
        embed,
        score,
    },
};
