import Config from './config.json';

const hideContentPH = () => $('#contentPH').hide();  // hide content placeholder (loading)

const uniqueId = num => { // unique id 1 in 10^15 chance of collision
    if (typeof num === 'number') {
        var arr = [];
        for (var i = 0; i < num; i++) {
            arr.push(Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36));
        }
        return arr;
    }
};

const pageTitle = (val) => {
    var title = 'MegaMovie ';
    switch (location.pathname) {
        case '/actor': title += val; break;
        case '/show': title += val; break;
        case '/showlist': title += ' Show List'; break;
        case '/actors': title += ' Actors'; break;
        default: break;
    }
    return title;
};

const showListURL = searchTerm => { // construct ShowList URL
    if (typeof searchTerm === 'string') {
        return Config.searchURL + encodeURI(searchTerm) + Config.apiKeyParam;
    }
};

const dateDMY = val => { // change date format
    if (typeof val === 'string') {
        return val.split('-').reverse().join('/');
    }
};

const getNamesStr = arr => { // get name values from arrays
    if (Array.isArray(arr)) {
        return arr.map(x => x.name).join(', ');
    }
};

const strConcat = (str, len) => { // shorten long movie plots
    if (typeof str === 'string' && str.length > len) {
        str = str.substring(0, len);
        var lastSpace = str.lastIndexOf(' ');
        str = str.substring(0, lastSpace) + '...';
    }
    return str;
};

const showCatURL = cat => { // return category URL for homepage
    switch (cat) {
        case 'Now Playing': return Config.nowPlayingURL;
        case 'Top Rated': return Config.topRatedURL;
        case 'Popular': return Config.popularURL;
        case 'Upcoming': return Config.upcomingURL;
    }
};

const showHideCredits = (e) => { // show/hide cast members on show page
    $('.credits .hide').toggleClass('display');
    e.target.innerText = e.target.innerText === 'Show more credits' ? 'Show less credits' : 'Show more credits';
};

const showHideSimilar = (e) => { // show/hide similar movies on show page
    var text = e.target.innerText;
    $('.showHide .hide').toggleClass('display');
    e.target.innerText = e.target.innerText.indexOf('more') === -1 ? text.replace('less', 'more') : text.replace('more', 'less');
};

function fetchSingle(url) {
    if (url && typeof url === 'string') {
        fetch(url).then((response) => {
            return response.json();
        }).then((data) => {
            this.setState({ data: data });
            hideContentPH();
        }).catch((err) => {
            console.log(new Error(err));
        });
    }
}

function fetchHomeData(urls) {

    if (Array.isArray(urls)) {
        var apiRequests = [];
        for (var i = 0; i < urls.length; i++) {
            apiRequests[i] = fetch(urls[i])
                .then(response => response.json())
                .catch(err => console.log(new Error(err)));
        }
        var combinedData = [];

        Promise.all(apiRequests)
            .then(data => {
                data.map((arr, ind) => {
                    if (arr && arr.results) {
                        var arr3Items = arr.results.slice(0, Config.homePageResultsLimit); // just return top 3 results             
                        for (var i = 0; i < arr3Items.length; i++) { // add category css class for different styling
                            var el = arr3Items[i];
                            el['css_class'] = this.categorys[ind];
                        }
                        //create 4 arrays, one with title and 3 with data
                        combinedData = combinedData.concat(this.categorys[ind]).concat(arr.results.slice(0, 3));
                    }
                });
            })
            .then(() => {
                this.setState({ data: combinedData });
                hideContentPH();
            })
            .catch(err =>
                console.log(new Error(err))
            );

    }
}

function fetchMultiple(urls) {
    if (Array.isArray(urls)) {

        var apiRequests = [];
        for (var i = 0; i < urls.length; i++) {
            apiRequests[i] = fetch(urls[i])
                .then(response => response.json())
                .catch(err => console.log(new Error(err)));
        }

        Promise.all(apiRequests)
            .then(data => {
                this.setState({ data: data });
                hideContentPH();
            })
            .catch(err => {
                console.log(new Error(err));
            });
    }
}

export { dateDMY, getNamesStr, fetchSingle, fetchHomeData, fetchMultiple, hideContentPH, pageTitle, showListURL, showHideCredits, strConcat, showHideSimilar, showCatURL, uniqueId };