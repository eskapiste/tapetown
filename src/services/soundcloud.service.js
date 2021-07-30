import _ from 'lodash';
import { of, from } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { map, switchMap, catchError } from 'rxjs/operators';
import { SOUNDCLOUD_URL } from './constants';

class Soundcloud {
    constructor(url) {
        this.url = url;
    }

    getObservable() {
        return fromFetch(this.url).pipe(
            switchMap((res) => (res.ok ? res.text() : of({ error: true, message: res.status }))),

            map((data) => new window.DOMParser().parseFromString(data, "text/xml")),

            switchMap((data) => from(data.querySelectorAll('item'))),

            map((item) => ({
                picture: _.first(item.getElementsByTagName('itunes:image')).getAttribute('href'),
                song: _.first(item.getElementsByTagName('enclosure')).getAttribute('url')
            })),

            catchError((err) => of({ error: true, message: err.message }))
        );
    }
}

export const soundcloudService = new Soundcloud(SOUNDCLOUD_URL);
