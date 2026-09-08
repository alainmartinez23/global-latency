import http from 'k6/http';
import { sleep } from 'k6';

/**
 * 5 regions:
 *  - virginia: loadZone: 'amazon:us:ashburn',
 *  - frankfurt: loadZone: 'amazon:de:frankfurt'
 *  - saoPaulo: loadZone: 'amazon:br:sao paulo'
 *  - tokyo: loadZone: 'amazon:jp:tokyo'
 *  - sydney: loadZone: 'amazon:au:sydney'
 */



const ENDPOINT_TO_TEST_POST = "<https://<endpoint>"

export const options = {
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],

    cloud: {
        distribution: {
            sydney: {
                loadZone: 'amazon:au:sydney',
                percent: 100,
            },
        },
    },

    vus: 1,
    duration: '1m',
};

export default function () {
    const payload = JSON.stringify({
        title: `k6 task ${Date.now()}`,
        description: 'Global write latency test',
        status: 'pending'
    });

    const res = http.post(
        ENDPOINT_TO_TEST_POST,
        payload,
        {
            headers: {
                'Content-Type': 'application/json'
            },
            tags: {
                region: 'sydney',
                operation: 'post'
            }
        }
    );

    if (res.status !== 201) {
        console.error(`POST failed: ${res.status} - ${res.body}`);
    }

    sleep(1);
}