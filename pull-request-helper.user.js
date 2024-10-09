// ==UserScript==
// @match         http://tracker.moodle.org/browse/*
// @match         https://tracker.moodle.org/browse/*
// @name          Pull Request Helper
// @description   Makes copy and paste easier for Moodle integrators
// @author        Andrew Nicols
// @homepage      http://github.com/andrewnicols/userscripts-moodle
// @namespace     http://userscripts.andrewrn.co.uk
// @downloadURL   https://github.com/andrewnicols/userscripts-moodle/raw/fork/pull-request-helper.user.js
// @version       4.05.0.0
// ==/UserScript==

var userScript = function() {
    var userScriptContent = {
        branches: [
            {
                shortname: 'main',
                customField: '10111',
                branchname: 'main'
            },
            {
                shortname: '405',
                customField: '17110',
                branchname: 'MOODLE_405_STABLE'
            },
            {
                shortname: '404',
                customField: '16910',
                branchname: 'MOODLE_404_STABLE'
            },
            {
                shortname: '403',
                customField: '16621',
                branchname: 'MOODLE_403_STABLE'
            },
            {
                shortname: '402',
                customField: '16510',
                branchname: 'MOODLE_402_STABLE'
            },
            {
                shortname: '401',
                customField: '16212',
                branchname: 'MOODLE_401_STABLE'
            },
            {
                shortname: '400',
                customField: '15910',
                branchname: 'MOODLE_400_STABLE'
            },
            {
                shortname: '311',
                customField: '15610',
                branchname: 'MOODLE_311_STABLE'
            },
            {
                shortname: '310',
                customField: '15428',
                branchname: 'MOODLE_310_STABLE'
            },
            {
                shortname: '39',
                customField: '15421',
                branchname: 'MOODLE_39_STABLE'
            },
            {
                shortname: '38',
                customField: '14910',
                branchname: 'MOODLE_38_STABLE'
            },
            {
                shortname: '37',
                customField: '14810',
                branchname: 'MOODLE_37_STABLE'
            },
            {
                shortname: '36',
                customField: '14610',
                branchname: 'MOODLE_36_STABLE'
            },
            {
                shortname: '35',
                customField: '14311',
                branchname: 'MOODLE_35_STABLE'
            },
            {
                shortname: '34',
                customField: '14212',
                branchname: 'MOODLE_34_STABLE'
            },
            {
                shortname: '33',
                customField: '14210',
                branchname: 'MOODLE_33_STABLE'
            },
            {
                shortname: '32',
                customField: '13911',
                branchname: 'MOODLE_32_STABLE'
            },
            {
                shortname: '31',
                customField: '13113',
                branchname: 'MOODLE_31_STABLE'
            },
            {
                shortname: '30',
                customField: '12911',
                branchname: 'MOODLE_30_STABLE'
            },
            {
                security: true,
                shortname: '29',
                customField: '12311',
                branchname: 'MOODLE_29_STABLE'
            },
            {
                deprecated: true,
                shortname: '28',
                customField: '12013',
                branchname: 'MOODLE_28_STABLE'
            },
            {
                security: true,
                shortname: '27',
                customField: '11710',
                branchname: 'MOODLE_27_STABLE'
            }
        ],

        updateView: function() {
            // First we check for a valid git repository being listed.
            var gitrepo = AJS.$('#customfield_10100-val').text().trim();
            if (!gitrepo.length) {
                return;
            }

            // https://github.blog/2021-09-01-improving-git-protocol-security-github/#no-more-unauthenticated-git
            gitrepo = gitrepo.replace('git://github.com', 'https://github.com');

            var cs = '';

            userScriptContent.branches.forEach(function(branch) {
                branch.customFieldNode = AJS.$('#customfield_' + branch.customField + '-val');
                if (branch.customFieldNode.length) {
                    var remoteBranchName = branch.customFieldNode.text().trim(),
                        style = ''
                        ;

                    if (branch.deprecated) {
                        style = 'background-color: red';
                    } else if (branch.security) {
                        style = 'background-color: orange';
                    }
                    cs +=
                        '<dl style="' + style + '">' +
                            '<dt>' +
                                branch.shortname +
                                '<br>' +
                            '</dt>' +
                            '<dd>' +
                                '<pre>' +
                                    'git checkout ' + branch.branchname + " && " +
                                    'git pull ' + gitrepo + ' ' + remoteBranchName + "\n" +
                                '</pre>' +
                            '</dd>' +
                        '</dl>'
                        ;
                }
            });

            if (!cs) {
                // No content on this issue.
                return;
            }

            var template = '' +
                '<div id="userscript_integrator_cs" class="module toggle-wrap">' +
                    '<div id="userscript_integrator_cs_heading" class="mod-header">' +
                        '<ul class="ops"></ul>' +
                        '<h2 class="toggle-title">Pull Branches</h2>' +
                    '</div>' +
                    '<div class="mod-content">' +
                        '<ul class="item-details" id="userscript_integrator_cs-details">' +
                            '<li class="userscript_integrator_cs-details">' +
                                '%cheatsheet%' +
                            '</li>' +
                        '</ul>' +
                    '</div>' +
                '</div>'
                ;


            var content         = template.replace('%cheatsheet%', cs.trim()),
                targetSection   = AJS.$('#userscript_integrator_cs')
                ;
            if (targetSection.length) {
                targetSection.replaceWith(content);
            } else {
                targetSection = AJS.$('#details-module');
                if (targetSection.length) {
                    targetSection.before(content);
                }
            }

            // Note: This must go after DOM insertion because the items must exist in the DOM before we attempt to update them.
            userScriptContent.branches.forEach(function(branch) {
                if (branch.customFieldNode.length) {
                    var remoteBranchName = branch.customFieldNode.text().trim();
                }
            });
        },
        setup: function() {
            userScriptContent.updateView();

            // But we also want to register it for when ajax stuff happens too..
            AJS.$(function() {
                if (JIRA.Events.ISSUE_REFRESHED) {
                    JIRA.bind(JIRA.Events.ISSUE_REFRESHED, function () {
                        userScriptContent.updateView();
                    });
                }
            });
        }
    };
    userScriptContent.setup();
};

// Hack to make this script work for Chrome.
// Note: We cannot use the global jQuery here.
var winScript = document.createElement('script');
winScript.appendChild(document.createTextNode('(' + userScript + ')();'));
(document.body || document.head || document.documentElement).appendChild(winScript);
