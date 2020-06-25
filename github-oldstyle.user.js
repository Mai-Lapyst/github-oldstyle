// ==UserScript==
// @name         Github-oldstyle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Userscript to bring the old github style back, should be used with the user-css in the same repo (see homepage)
// @author       Mai Lapyst
// @match        https://github.com/*
// @grant        none
// @homepage     https://github.com/Mai-Lapyst/github-oldstyle
// ==/UserScript==

(function() {
    'use strict';

    // options, what to change back...
    var options = {
        // 'true' if the latest commit layout should be reverted to the old style
        latestCommit: true,
    };

    var $ = (query) => {
        var l = document.querySelectorAll(query);
        if (l.length == 1) {
            return l[0];
        }
        return l;
    };
    var e = null;

    {
        let elem = document.createElement('div');
        elem.className = 'mt-2';
        $('.new-discussion-timeline').prepend(elem);
    }

    // Add the bar that gives a overview of the used languages in the repo
    {
        let container = document.createElement('details');
        container.className = 'details-reset';
        $('.new-discussion-timeline').prepend(container);

        let elem = document.createElement('summary');
        elem.setAttribute('title','Click for language details');
        elem.setAttribute('data-ga-click','Repository, language bar stats toggle, location:repo overview');
        container.append(elem);

        let progBar = $('.Progress')[1];
        progBar.classList.add("repository-lang-stats-graph");
        elem.append(progBar);

        let langStats = document.createElement('div');
        langStats.className = 'repository-lang-stats';
        container.append(langStats);

        let langList = $('.repository-content>.gutter-condensed>:nth-child(2)>:nth-child(1)>:nth-last-child(1)>:nth-child(1)>:nth-last-child(1)');
        langList.classList.add('repository-lang-stats-numbers');
        langStats.append(langList);
    }

    // Add the bar with repo infos back: commit-, branch-, package-, tag- and contributor count
    {
        let container = document.createElement('div');
        container.className = 'overall-summary border-bottom-0 mb-0 rounded-bottom-0';
        $('.new-discussion-timeline').prepend(container);

        let ul = document.createElement('ul');
        ul.className = 'numbers-summary';
        container.append(ul);

        let newLi = () => { return document.createElement('li'); }
        {
            let elem = $('a[href$="commits/master"]');
            let li = newLi();
            li.className = 'commits';
            li.append(elem);
            ul.append(li);
        }
        {
            let elem = $('a[href$="/branches"]');
            let li = newLi();
            li.append(elem);
            ul.append(li);
        }
        {
            let elem = document.createElement('a');
            elem.innerText = "Packages";
            let li = newLi();
            li.append(elem);
            ul.append(li);
        }
        {
            let elem = $('a[href$="/tags"]');
            let li = newLi();
            li.append(elem);
            ul.append(li);
        }
        {
            // contributors
            let elem = document.createElement('a');
            elem.innerText = "Contributors";
            let li = newLi();
            li.append(elem);
            ul.append(li);
        }
        {
            // licence tab
            let elem = $('.repository-content>.gutter-condensed>:nth-child(2)>:nth-child(1)>:nth-child(1)>:nth-child(1)>:nth-last-child(1)>:nth-child(1)');
            let li = newLi();
            li.append(elem);
            ul.append(li);
        }
    }

    // ------------------------------------------------------------
    // -- change last commit style
    // ------------------------------------------------------------
    if (options.latestCommit) {
        console.log("try to change latest commit");

        let container = $('.repository-content .js-details-container')[0];
        let detailContainer = container.querySelector('.Details-content--hidden');

        // strange behavior: it seems that github is experimenting on various nodes witth its
        // approach to load the last commit:
        //  - either the whole last commit element is loaded with javascript with include-fragment
        //  - or its already present in html, and the build/check status is present through a include-fragment

        // check if the whole middle element (our last commit data: sha and timestap) has an include-fragment

        //console.log("wait for fragment", fragment);
        //fragment.addEventListener('load', function() {
            // delete the text "committed"
            container.querySelector('.css-truncate').childNodes[2].remove();

            let commitSHA = container.querySelector('a[href*="/commit/"]');
            let commitTime = container.querySelector('relative-time');

            let rContainer = document.createElement('div');
            rContainer.append(document.createTextNode(' Latest commit '))
            rContainer.append(commitSHA);
            rContainer.append(document.createTextNode(' '));
            rContainer.append(commitTime);

            container.append(rContainer);

        //});

        let buildStatusFragment = container.querySelector('include-fragment[src*="/rollup?direction="]');
        // TODO make sure we have the fragment

        buildStatusFragment.addEventListener('load', function(elem) {
            rContainer.prepend(container.querySelector('details.commit-build-statuses'));
            // TODO: the popup opens to the right, this is a bit inconvinent for the old layout, it should switch to left
        });

        let btn = container.querySelector('.hidden-text-expander');
        for (let i = 0; i < 3; i++) {
            container.children[1].insertBefore(detailContainer.children[0], btn);
        }
    }

    // ------------------------------------------------------------
    // -- undo roundings of buttons
    // ------------------------------------------------------------
    e = $('.btn');
    for (let elem of e) {
        for (let s of ["top-right","top-left","bottom-right","bottom-left"]) {
            let cs = window.getComputedStyle(elem);
            let v = cs.getPropertyValue("border-" + s + "-radius");
            if (v == "6px") {
                elem.style["border-"+s+"-radius"] = "3px";
            }
        }
    }

})();
