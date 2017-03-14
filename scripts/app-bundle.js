define('app',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            config.title = 'Aurelia';
            config.map([
                { route: ['', 'spiritvms'], name: 'spiritvms', moduleId: 'modules/spirit/vms', nav: true, title: 'SPIRIT VMs' },
                { route: 'spiritbuilds', name: 'spiritbuilds', moduleId: 'modules/spirit/builds', nav: true, title: 'SPIRIT Builds' }
            ]);
            this.router = router;
        };
        App.prototype.attached = function () {
            $.AdminLTE.layout.fix();
        };
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", "./environment"], function (require, exports, environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources')
            .plugin('aurelia-syncfusion-bridge', function (syncfusion) { return syncfusion.ejGrid().ejTemplate(); });
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
    }
    exports.configure = configure;
});

define('modules/spirit/builds',["require", "exports", "pouchdb", "pouchdb-find"], function (require, exports, PouchDB, PouchDBFind) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    PouchDB.plugin(PouchDBFind);
    var rmsbuilds = (function () {
        function rmsbuilds() {
            var _this = this;
            this.edit = { allowEditing: true, allowAdding: true, allowDeleting: true, editMode: "normal", showAddNewRow: true };
            this.toolbar = { showToolbar: true, toolbarItems: ["add", "edit", "delete", "update", "cancel"] };
            this.remoteCouch = 'http://resman_web:resman_web@kydevbuild01.cdps.cdp:5984/resman';
            this.doc_type = 'spirit_build';
            this.db = new PouchDB('resman');
            this.loadBuilds = function () {
                _this.db.find({
                    selector: { doc_type: _this.doc_type }
                }).then(function (results) {
                    _this.builds = results.docs;
                }).catch(function (err) {
                    _this.log(err, true);
                });
            };
            this.loadBuilds();
            this.db.sync(this.remoteCouch, {
                live: true
            }).on('change', function (change) {
                _this.loadBuilds();
            }).on('error', function (err) {
                console.log(err);
            });
        }
        rmsbuilds.prototype.afterEdit = function (e) {
            var _this = this;
            this.db.get(e.data._id).then(function (build) {
                build.doc_type = _this.doc_type;
                build.build_id = e.data.build_id;
                build.version = e.data.version;
                build.location = e.data.location;
                build.stories = e.data.stories;
                build.notify = e.data.notify;
                build.spirit = e.data.spirit;
                build.build_date = e.data.build_date;
                build.time_entry_task = e.data.time_entry_task;
                _this.db.put(build).catch(function (err) {
                    _this.log(err, true);
                });
            });
        };
        rmsbuilds.prototype.afterAdd = function (e) {
            var _this = this;
            var build = new Build();
            build.doc_type = this.doc_type;
            build.build_id = e.data.build_id;
            build.version = e.data.version;
            build.location = e.data.location;
            build.stories = e.data.stories;
            build.notify = e.data.notify;
            build.spirit = e.data.spirit;
            build.build_date = e.data.build_date;
            build.time_entry_task = e.data.time_entry_task;
            this.db.post(build).catch(function (err) {
                _this.log(err, true);
            });
        };
        rmsbuilds.prototype.afterDelete = function (e) {
            var _this = this;
            this.db.get(e.data._id).then(function (build) {
                _this.db.remove(build._id, build._rev).catch(function (err) {
                    _this.log(err, true);
                });
            });
        };
        rmsbuilds.prototype.log = function (err, showAlert) {
            if (showAlert === void 0) { showAlert = false; }
            console.log(err);
            if (showAlert) {
                alert(err);
            }
        };
        rmsbuilds.prototype.recordClick = function (e) {
        };
        return rmsbuilds;
    }());
    exports.rmsbuilds = rmsbuilds;
    var Build = (function () {
        function Build() {
        }
        return Build;
    }());
    exports.Build = Build;
});

define('modules/spirit/vms',["require", "exports", "pouchdb", "pouchdb-find"], function (require, exports, PouchDB, PouchDBFind) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    PouchDB.plugin(PouchDBFind);
    var rmsvms = (function () {
        function rmsvms() {
            var _this = this;
            this.edit = { allowEditing: true, allowAdding: true, allowDeleting: true, editMode: "normal", showAddNewRow: true };
            this.toolbar = { showToolbar: true, toolbarItems: ["add", "edit", "delete", "update", "cancel"] };
            this.remoteCouch = 'http://resman_web:resman_web@kydevbuild01.cdps.cdp:5984/resman';
            this.doc_type = 'spirit_machine';
            this.db = new PouchDB('resman');
            this.loadResources = function () {
                _this.db.find({
                    selector: { doc_type: _this.doc_type }
                }).then(function (results) {
                    _this.resources = results.docs;
                }).catch(function (err) {
                    _this.log(err, true);
                });
            };
            this.loadResources();
            this.db.sync(this.remoteCouch, {
                live: true
            }).on('change', function (change) {
                _this.loadResources();
            }).on('error', function (err) {
                console.log(err);
            });
        }
        rmsvms.prototype.afterEdit = function (e) {
            var _this = this;
            this.db.get(e.data._id).then(function (resource) {
                resource.doc_type = e.data.doc_type;
                resource.resource_name = e.data.resource_name;
                resource.default_url = e.data.default_url;
                resource.purpose = e.data.purpose;
                resource.resource_type_id = e.data.resource_type_id;
                resource.record_status_id = e.data.record_status_id;
                _this.db.put(resource).catch(function (err) {
                    _this.log(err, true);
                });
            });
        };
        rmsvms.prototype.afterAdd = function (e) {
            var _this = this;
            var resource = new Resource();
            resource.doc_type = this.doc_type,
                resource.id = e.data.id,
                resource.resource_name = e.data.resource_name,
                resource.default_url = e.data.default_url,
                resource.purpose = e.data.purpose,
                resource.resource_type_id = e.data.resource_type_id,
                resource.record_status_id = e.data.record_status_id;
            this.db.post(resource).catch(function (err) {
                _this.log(err, true);
            });
        };
        rmsvms.prototype.afterDelete = function (e) {
            var _this = this;
            this.db.get(e.data._id).then(function (resource) {
                _this.db.remove(resource._id, resource._rev).catch(function (err) {
                    _this.log(err, true);
                });
            });
        };
        rmsvms.prototype.log = function (err, showAlert) {
            if (showAlert === void 0) { showAlert = false; }
            console.log(err);
            if (showAlert) {
                alert(err);
            }
        };
        rmsvms.prototype.recordClick = function (e) {
        };
        return rmsvms;
    }());
    exports.rmsvms = rmsvms;
    var Resource = (function () {
        function Resource() {
        }
        return Resource;
    }());
    exports.Resource = Resource;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"../node_modules/bootstrap/dist/css/bootstrap.min.css\"></require><link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css\"><link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css\"><require from=\"../node_modules/admin-lte/dist/css/AdminLTE.min.css\"></require><require from=\"../../dist/css/skins/_all-skins.min.css\"></require><require from=\"../node_modules/syncfusion-javascript/Content/ej/web/default-theme/ej.theme.min.css\"></require><require from=\"../node_modules/syncfusion-javascript/Content/ej/web/default-theme/ej.web.all.min.css\"></require><div class=\"wrapper\"><header class=\"main-header\"><a href=\"../../index2.html\" class=\"logo\"><span class=\"logo-mini\"><b>A</b>LT</span><span class=\"logo-lg\"><b>Admin</b>LTE</span></a><nav class=\"navbar navbar-static-top\"><a href=\"#\" class=\"sidebar-toggle\" data-toggle=\"offcanvas\" role=\"button\"><span class=\"sr-only\">Toggle navigation</span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span></a><div class=\"navbar-custom-menu\"><ul class=\"nav navbar-nav\"><li class=\"dropdown messages-menu\"><a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\"><i class=\"fa fa-envelope-o\"></i> <span class=\"label label-success\">4</span></a><ul class=\"dropdown-menu\"><li class=\"header\">You have 4 messages</li><li><ul class=\"menu\"><li><a href=\"#\"><div class=\"pull-left\"><img src=\"../../dist/img/user2-160x160.jpg\" class=\"img-circle\" alt=\"User Image\"></div><h4>Support Team <small><i class=\"fa fa-clock-o\"></i> 5 mins</small></h4><p>Why not buy a new awesome theme?</p></a></li></ul></li><li class=\"footer\"><a href=\"#\">See All Messages</a></li></ul></li><li class=\"dropdown notifications-menu\"><a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\"><i class=\"fa fa-bell-o\"></i> <span class=\"label label-warning\">10</span></a><ul class=\"dropdown-menu\"><li class=\"header\">You have 10 notifications</li><li><ul class=\"menu\"><li><a href=\"#\"><i class=\"fa fa-users text-aqua\"></i> 5 new members joined today</a></li></ul></li><li class=\"footer\"><a href=\"#\">View all</a></li></ul></li><li class=\"dropdown tasks-menu\"><a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\"><i class=\"fa fa-flag-o\"></i> <span class=\"label label-danger\">9</span></a><ul class=\"dropdown-menu\"><li class=\"header\">You have 9 tasks</li><li><ul class=\"menu\"><li><a href=\"#\"><h3>Design some buttons <small class=\"pull-right\">20%</small></h3><div class=\"progress xs\"><div class=\"progress-bar progress-bar-aqua\" style=\"width:20%\" role=\"progressbar\" aria-valuenow=\"20\" aria-valuemin=\"0\" aria-valuemax=\"100\"><span class=\"sr-only\">20% Complete</span></div></div></a></li></ul></li><li class=\"footer\"><a href=\"#\">View all tasks</a></li></ul></li><li class=\"dropdown user user-menu\"><a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\"><img src=\"../../dist/img/user2-160x160.jpg\" class=\"user-image\" alt=\"User Image\"> <span class=\"hidden-xs\">Alexander Pierce</span></a><ul class=\"dropdown-menu\"><li class=\"user-header\"><img src=\"../../dist/img/user2-160x160.jpg\" class=\"img-circle\" alt=\"User Image\"><p>Alexander Pierce - Web Developer <small>Member since Nov. 2012</small></p></li><li class=\"user-body\"><div class=\"row\"><div class=\"col-xs-4 text-center\"><a href=\"#\">Followers</a></div><div class=\"col-xs-4 text-center\"><a href=\"#\">Sales</a></div><div class=\"col-xs-4 text-center\"><a href=\"#\">Friends</a></div></div></li><li class=\"user-footer\"><div class=\"pull-left\"><a href=\"#\" class=\"btn btn-default btn-flat\">Profile</a></div><div class=\"pull-right\"><a href=\"#\" class=\"btn btn-default btn-flat\">Sign out</a></div></li></ul></li><li><a href=\"#\" data-toggle=\"control-sidebar\"><i class=\"fa fa-gears\"></i></a></li></ul></div></nav></header><aside class=\"main-sidebar\"><section class=\"sidebar\"><div class=\"user-panel\"><div class=\"pull-left image\"><img src=\"../../dist/img/user2-160x160.jpg\" class=\"img-circle\" alt=\"User Image\"></div><div class=\"pull-left info\"><p>Alexander Pierce</p><a href=\"#\"><i class=\"fa fa-circle text-success\"></i> Online</a></div></div><form action=\"#\" method=\"get\" class=\"sidebar-form\"><div class=\"input-group\"><input type=\"text\" name=\"q\" class=\"form-control\" placeholder=\"Search...\"> <span class=\"input-group-btn\"><button type=\"submit\" name=\"search\" id=\"search-btn\" class=\"btn btn-flat\"><i class=\"fa fa-search\"></i></button></span></div></form><ul class=\"sidebar-menu\"><li class=\"header\">MAIN NAVIGATION</li><li class=\"treeview\"><a href=\"#\"><i class=\"fa fa-dashboard\"></i> <span>Dashboard</span> <span class=\"pull-right-container\"><i class=\"fa fa-angle-left pull-right\"></i></span></a><ul class=\"treeview-menu\"><li><a href=\"../../index.html\"><i class=\"fa fa-circle-o\"></i> Dashboard v1</a></li><li><a href=\"../../index2.html\"><i class=\"fa fa-circle-o\"></i> Dashboard v2</a></li></ul></li><li class=\"treeview\"><a href=\"#\"><i class=\"fa fa-files-o\"></i> <span>Layout Options</span> <span class=\"pull-right-container\"><span class=\"label label-primary pull-right\">4</span></span></a><ul class=\"treeview-menu\"><li><a href=\"../layout/top-nav.html\"><i class=\"fa fa-circle-o\"></i> Top Navigation</a></li><li><a href=\"../layout/boxed.html\"><i class=\"fa fa-circle-o\"></i> Boxed</a></li><li><a href=\"../layout/fixed.html\"><i class=\"fa fa-circle-o\"></i> Fixed</a></li><li><a href=\"../layout/collapsed-sidebar.html\"><i class=\"fa fa-circle-o\"></i> Collapsed Sidebar</a></li></ul></li><li><a href=\"../widgets.html\"><i class=\"fa fa-th\"></i> <span>Widgets</span> <span class=\"pull-right-container\"><small class=\"label pull-right bg-green\">Hot</small></span></a></li><li class=\"treeview\"><a href=\"#\"><i class=\"fa fa-pie-chart\"></i> <span>Charts</span> <span class=\"pull-right-container\"><i class=\"fa fa-angle-left pull-right\"></i></span></a><ul class=\"treeview-menu\"><li><a href=\"../charts/chartjs.html\"><i class=\"fa fa-circle-o\"></i> ChartJS</a></li><li><a href=\"../charts/morris.html\"><i class=\"fa fa-circle-o\"></i> Morris</a></li><li><a href=\"../charts/flot.html\"><i class=\"fa fa-circle-o\"></i> Flot</a></li><li><a href=\"../charts/inline.html\"><i class=\"fa fa-circle-o\"></i> Inline charts</a></li></ul></li><li class=\"treeview\"><a href=\"#\"><i class=\"fa fa-laptop\"></i> <span>UI Elements</span> <span class=\"pull-right-container\"><i class=\"fa fa-angle-left pull-right\"></i></span></a><ul class=\"treeview-menu\"><li><a href=\"../UI/general.html\"><i class=\"fa fa-circle-o\"></i> General</a></li><li><a href=\"../UI/icons.html\"><i class=\"fa fa-circle-o\"></i> Icons</a></li><li><a href=\"../UI/buttons.html\"><i class=\"fa fa-circle-o\"></i> Buttons</a></li><li><a href=\"../UI/sliders.html\"><i class=\"fa fa-circle-o\"></i> Sliders</a></li><li><a href=\"../UI/timeline.html\"><i class=\"fa fa-circle-o\"></i> Timeline</a></li><li><a href=\"../UI/modals.html\"><i class=\"fa fa-circle-o\"></i> Modals</a></li></ul></li><li class=\"treeview\"><a href=\"#\"><i class=\"fa fa-edit\"></i> <span>Forms</span> <span class=\"pull-right-container\"><i class=\"fa fa-angle-left pull-right\"></i></span></a><ul class=\"treeview-menu\"><li><a href=\"../forms/general.html\"><i class=\"fa fa-circle-o\"></i> General Elements</a></li><li><a href=\"../forms/advanced.html\"><i class=\"fa fa-circle-o\"></i> Advanced Elements</a></li><li><a href=\"../forms/editors.html\"><i class=\"fa fa-circle-o\"></i> Editors</a></li></ul></li><li class=\"treeview\"><a href=\"#\"><i class=\"fa fa-table\"></i> <span>Tables</span> <span class=\"pull-right-container\"><i class=\"fa fa-angle-left pull-right\"></i></span></a><ul class=\"treeview-menu\"><li><a href=\"../tables/simple.html\"><i class=\"fa fa-circle-o\"></i> Simple tables</a></li><li><a href=\"../tables/data.html\"><i class=\"fa fa-circle-o\"></i> Data tables</a></li></ul></li><li><a href=\"../calendar.html\"><i class=\"fa fa-calendar\"></i> <span>Calendar</span> <span class=\"pull-right-container\"><small class=\"label pull-right bg-red\">3</small> <small class=\"label pull-right bg-blue\">17</small></span></a></li><li><a href=\"../mailbox/mailbox.html\"><i class=\"fa fa-envelope\"></i> <span>Mailbox</span> <span class=\"pull-right-container\"><small class=\"label pull-right bg-yellow\">12</small> <small class=\"label pull-right bg-green\">16</small> <small class=\"label pull-right bg-red\">5</small></span></a></li><li class=\"treeview active\"><a href=\"#\"><i class=\"fa fa-folder\"></i> <span>Examples</span> <span class=\"pull-right-container\"><i class=\"fa fa-angle-left pull-right\"></i></span></a><ul class=\"treeview-menu\"><li><a href=\"invoice.html\"><i class=\"fa fa-circle-o\"></i> Invoice</a></li><li><a href=\"profile.html\"><i class=\"fa fa-circle-o\"></i> Profile</a></li><li><a href=\"login.html\"><i class=\"fa fa-circle-o\"></i> Login</a></li><li><a href=\"register.html\"><i class=\"fa fa-circle-o\"></i> Register</a></li><li><a href=\"lockscreen.html\"><i class=\"fa fa-circle-o\"></i> Lockscreen</a></li><li><a href=\"404.html\"><i class=\"fa fa-circle-o\"></i> 404 Error</a></li><li><a href=\"500.html\"><i class=\"fa fa-circle-o\"></i> 500 Error</a></li><li class=\"active\"><a href=\"blank.html\"><i class=\"fa fa-circle-o\"></i> Blank Page</a></li><li><a href=\"pace.html\"><i class=\"fa fa-circle-o\"></i> Pace Page</a></li></ul></li><li class=\"treeview\"><a href=\"#\"><i class=\"fa fa-share\"></i> <span>Multilevel</span> <span class=\"pull-right-container\"><i class=\"fa fa-angle-left pull-right\"></i></span></a><ul class=\"treeview-menu\"><li><a href=\"#\"><i class=\"fa fa-circle-o\"></i> Level One</a></li><li><a href=\"#\"><i class=\"fa fa-circle-o\"></i> Level One <span class=\"pull-right-container\"><i class=\"fa fa-angle-left pull-right\"></i></span></a><ul class=\"treeview-menu\"><li><a href=\"#\"><i class=\"fa fa-circle-o\"></i> Level Two</a></li><li><a href=\"#\"><i class=\"fa fa-circle-o\"></i> Level Two <span class=\"pull-right-container\"><i class=\"fa fa-angle-left pull-right\"></i></span></a><ul class=\"treeview-menu\"><li><a href=\"#\"><i class=\"fa fa-circle-o\"></i> Level Three</a></li><li><a href=\"#\"><i class=\"fa fa-circle-o\"></i> Level Three</a></li></ul></li></ul></li><li><a href=\"#\"><i class=\"fa fa-circle-o\"></i> Level One</a></li></ul></li><li><a href=\"../../documentation/index.html\"><i class=\"fa fa-book\"></i> <span>Documentation</span></a></li><li class=\"header\">LABELS</li><li><a href=\"#\"><i class=\"fa fa-circle-o text-red\"></i> <span>Important</span></a></li><li><a href=\"#\"><i class=\"fa fa-circle-o text-yellow\"></i> <span>Warning</span></a></li><li><a href=\"#\"><i class=\"fa fa-circle-o text-aqua\"></i> <span>Information</span></a></li></ul></section></aside><div class=\"content-wrapper\"><section class=\"content-header\"><h1>Blank page <small>it all starts here</small></h1><ol class=\"breadcrumb\"><li><a href=\"#\"><i class=\"fa fa-dashboard\"></i> Home</a></li><li><a href=\"#\">Examples</a></li><li class=\"active\">Blank page</li></ol></section><section class=\"content\"><div class=\"box\"><div class=\"box-header with-border\"><h3 class=\"box-title\">Title</h3><div class=\"box-tools pull-right\"><button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"collapse\" data-toggle=\"tooltip\" title=\"Collapse\"><i class=\"fa fa-minus\"></i></button> <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"remove\" data-toggle=\"tooltip\" title=\"Remove\"><i class=\"fa fa-times\"></i></button></div></div><div class=\"box-body\"><router-view></router-view></div><div class=\"box-footer\">Footer</div></div></section></div><footer class=\"main-footer\"><div class=\"pull-right hidden-xs\"><b>Version</b> 2.3.8</div><strong>Copyright &copy; 2014-2016 <a href=\"http://almsaeedstudio.com\">Almsaeed Studio</a>.</strong> All rights reserved.</footer><aside class=\"control-sidebar control-sidebar-dark\"><ul class=\"nav nav-tabs nav-justified control-sidebar-tabs\"><li><a href=\"#control-sidebar-home-tab\" data-toggle=\"tab\"><i class=\"fa fa-home\"></i></a></li><li><a href=\"#control-sidebar-settings-tab\" data-toggle=\"tab\"><i class=\"fa fa-gears\"></i></a></li></ul><div class=\"tab-content\"><div class=\"tab-pane\" id=\"control-sidebar-home-tab\"><h3 class=\"control-sidebar-heading\">Recent Activity</h3><ul class=\"control-sidebar-menu\"><li><a href=\"javascript:void(0)\"><i class=\"menu-icon fa fa-birthday-cake bg-red\"></i><div class=\"menu-info\"><h4 class=\"control-sidebar-subheading\">Langdon's Birthday</h4><p>Will be 23 on April 24th</p></div></a></li><li><a href=\"javascript:void(0)\"><i class=\"menu-icon fa fa-user bg-yellow\"></i><div class=\"menu-info\"><h4 class=\"control-sidebar-subheading\">Frodo Updated His Profile</h4><p>New phone +1(800)555-1234</p></div></a></li><li><a href=\"javascript:void(0)\"><i class=\"menu-icon fa fa-envelope-o bg-light-blue\"></i><div class=\"menu-info\"><h4 class=\"control-sidebar-subheading\">Nora Joined Mailing List</h4><p>nora@example.com</p></div></a></li><li><a href=\"javascript:void(0)\"><i class=\"menu-icon fa fa-file-code-o bg-green\"></i><div class=\"menu-info\"><h4 class=\"control-sidebar-subheading\">Cron Job 254 Executed</h4><p>Execution time 5 seconds</p></div></a></li></ul><h3 class=\"control-sidebar-heading\">Tasks Progress</h3><ul class=\"control-sidebar-menu\"><li><a href=\"javascript:void(0)\"><h4 class=\"control-sidebar-subheading\">Custom Template Design <span class=\"label label-danger pull-right\">70%</span></h4><div class=\"progress progress-xxs\"><div class=\"progress-bar progress-bar-danger\" style=\"width:70%\"></div></div></a></li><li><a href=\"javascript:void(0)\"><h4 class=\"control-sidebar-subheading\">Update Resume <span class=\"label label-success pull-right\">95%</span></h4><div class=\"progress progress-xxs\"><div class=\"progress-bar progress-bar-success\" style=\"width:95%\"></div></div></a></li><li><a href=\"javascript:void(0)\"><h4 class=\"control-sidebar-subheading\">Laravel Integration <span class=\"label label-warning pull-right\">50%</span></h4><div class=\"progress progress-xxs\"><div class=\"progress-bar progress-bar-warning\" style=\"width:50%\"></div></div></a></li><li><a href=\"javascript:void(0)\"><h4 class=\"control-sidebar-subheading\">Back End Framework <span class=\"label label-primary pull-right\">68%</span></h4><div class=\"progress progress-xxs\"><div class=\"progress-bar progress-bar-primary\" style=\"width:68%\"></div></div></a></li></ul></div><div class=\"tab-pane\" id=\"control-sidebar-stats-tab\">Stats Tab Content</div><div class=\"tab-pane\" id=\"control-sidebar-settings-tab\"><form method=\"post\"><h3 class=\"control-sidebar-heading\">General Settings</h3><div class=\"form-group\"><label class=\"control-sidebar-subheading\">Report panel usage <input type=\"checkbox\" class=\"pull-right\" checked=\"checked\"></label><p>Some information about this general settings option</p></div><div class=\"form-group\"><label class=\"control-sidebar-subheading\">Allow mail redirect <input type=\"checkbox\" class=\"pull-right\" checked=\"checked\"></label><p>Other sets of options are available</p></div><div class=\"form-group\"><label class=\"control-sidebar-subheading\">Expose author name in posts <input type=\"checkbox\" class=\"pull-right\" checked=\"checked\"></label><p>Allow the user to show his name in blog posts</p></div><h3 class=\"control-sidebar-heading\">Chat Settings</h3><div class=\"form-group\"><label class=\"control-sidebar-subheading\">Show me as online <input type=\"checkbox\" class=\"pull-right\" checked=\"checked\"></label></div><div class=\"form-group\"><label class=\"control-sidebar-subheading\">Turn off notifications <input type=\"checkbox\" class=\"pull-right\"></label></div><div class=\"form-group\"><label class=\"control-sidebar-subheading\">Delete chat history <a href=\"javascript:void(0)\" class=\"text-red pull-right\"><i class=\"fa fa-trash-o\"></i></a></label></div></form></div></div></aside><div class=\"control-sidebar-bg\"></div></div></template>"; });
define('text!layout.html', ['module'], function(module) { module.exports = "<template><require from=\"plugins/jQuery/jquery-2.2.3.min.js\"></require><require from=\"bootstrap/js/bootstrap.min.js\"></require><require from=\"plugins/fastclick/fastclick.js\"></require><require from=\"dist/js/app.min.js\"></require><require from=\"plugins/slimScroll/jquery.slimscroll.min.js\"></require><require from=\"../../bootstrap/css/bootstrap.min.css\"></require><require from=\"../../dist/css/AdminLTE.min.css\"></require><require from=\"../../dist/css/skins/_all-skins.min.css\"></require><require from=\"../../../node_modules/syncfusion-javascript/Content/ej/web/default-theme/ej.web.all.min.css\"></require><require from=\"../../../node_modules/syncfusion-javascript/Content/ej/web/responsive-css/ej.responsive.css\"></require><require from=\"../assets/css/themify-icons.css\"></require><script src=\"scripts/vendor-bundle.js\" data-main=\"aurelia-bootstrapper\"></script><div class=\"wrapper\"><header class=\"main-header\"><a href=\"index2.html\" class=\"logo\"><span class=\"logo-mini\"><b>A</b>LT</span><span class=\"logo-lg\"><b>Admin</b>LTE</span></a><nav class=\"navbar navbar-static-top\"><a href=\"#\" class=\"sidebar-toggle\" data-toggle=\"offcanvas\" role=\"button\"><span class=\"sr-only\">Toggle navigation</span></a><div class=\"navbar-custom-menu\"><ul class=\"nav navbar-nav\"><li class=\"dropdown messages-menu\"><a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\"><i class=\"fa fa-envelope-o\"></i> <span class=\"label label-success\">4</span></a><ul class=\"dropdown-menu\"><li class=\"header\">You have 4 messages</li><li><ul class=\"menu\"><li><a href=\"#\"><div class=\"pull-left\"><img src=\"dist/img/user2-160x160.jpg\" class=\"img-circle\" alt=\"User Image\"></div><h4>Support Team <small><i class=\"fa fa-clock-o\"></i> 5 mins</small></h4><p>Why not buy a new awesome theme?</p></a></li><li><a href=\"#\"><div class=\"pull-left\"><img src=\"dist/img/user3-128x128.jpg\" class=\"img-circle\" alt=\"User Image\"></div><h4>AdminLTE Design Team <small><i class=\"fa fa-clock-o\"></i> 2 hours</small></h4><p>Why not buy a new awesome theme?</p></a></li><li><a href=\"#\"><div class=\"pull-left\"><img src=\"dist/img/user4-128x128.jpg\" class=\"img-circle\" alt=\"User Image\"></div><h4>Developers <small><i class=\"fa fa-clock-o\"></i> Today</small></h4><p>Why not buy a new awesome theme?</p></a></li><li><a href=\"#\"><div class=\"pull-left\"><img src=\"dist/img/user3-128x128.jpg\" class=\"img-circle\" alt=\"User Image\"></div><h4>Sales Department <small><i class=\"fa fa-clock-o\"></i> Yesterday</small></h4><p>Why not buy a new awesome theme?</p></a></li><li><a href=\"#\"><div class=\"pull-left\"><img src=\"dist/img/user4-128x128.jpg\" class=\"img-circle\" alt=\"User Image\"></div><h4>Reviewers <small><i class=\"fa fa-clock-o\"></i> 2 days</small></h4><p>Why not buy a new awesome theme?</p></a></li></ul></li><li class=\"footer\"><a href=\"#\">See All Messages</a></li></ul></li><li class=\"dropdown notifications-menu\"><a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\"><i class=\"fa fa-bell-o\"></i> <span class=\"label label-warning\">10</span></a><ul class=\"dropdown-menu\"><li class=\"header\">You have 10 notifications</li><li><ul class=\"menu\"><li><a href=\"#\"><i class=\"fa fa-users text-aqua\"></i> 5 new members joined today</a></li><li><a href=\"#\"><i class=\"fa fa-warning text-yellow\"></i> Very long description here that may not fit into the page and may cause design problems</a></li><li><a href=\"#\"><i class=\"fa fa-users text-red\"></i> 5 new members joined</a></li><li><a href=\"#\"><i class=\"fa fa-shopping-cart text-green\"></i> 25 sales made</a></li><li><a href=\"#\"><i class=\"fa fa-user text-red\"></i> You changed your username</a></li></ul></li><li class=\"footer\"><a href=\"#\">View all</a></li></ul></li><li class=\"dropdown tasks-menu\"><a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\"><i class=\"fa fa-flag-o\"></i> <span class=\"label label-danger\">9</span></a><ul class=\"dropdown-menu\"><li class=\"header\">You have 9 tasks</li><li><ul class=\"menu\"><li><a href=\"#\"><h3>Design some buttons <small class=\"pull-right\">20%</small></h3><div class=\"progress xs\"><div class=\"progress-bar progress-bar-aqua\" style=\"width:20%\" role=\"progressbar\" aria-valuenow=\"20\" aria-valuemin=\"0\" aria-valuemax=\"100\"><span class=\"sr-only\">20% Complete</span></div></div></a></li><li><a href=\"#\"><h3>Create a nice theme <small class=\"pull-right\">40%</small></h3><div class=\"progress xs\"><div class=\"progress-bar progress-bar-green\" style=\"width:40%\" role=\"progressbar\" aria-valuenow=\"20\" aria-valuemin=\"0\" aria-valuemax=\"100\"><span class=\"sr-only\">40% Complete</span></div></div></a></li><li><a href=\"#\"><h3>Some task I need to do <small class=\"pull-right\">60%</small></h3><div class=\"progress xs\"><div class=\"progress-bar progress-bar-red\" style=\"width:60%\" role=\"progressbar\" aria-valuenow=\"20\" aria-valuemin=\"0\" aria-valuemax=\"100\"><span class=\"sr-only\">60% Complete</span></div></div></a></li><li><a href=\"#\"><h3>Make beautiful transitions <small class=\"pull-right\">80%</small></h3><div class=\"progress xs\"><div class=\"progress-bar progress-bar-yellow\" style=\"width:80%\" role=\"progressbar\" aria-valuenow=\"20\" aria-valuemin=\"0\" aria-valuemax=\"100\"><span class=\"sr-only\">80% Complete</span></div></div></a></li></ul></li><li class=\"footer\"><a href=\"#\">View all tasks</a></li></ul></li><li class=\"dropdown user user-menu\"><a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\"><img src=\"dist/img/user2-160x160.jpg\" class=\"user-image\" alt=\"User Image\"> <span class=\"hidden-xs\">Alexander Pierce</span></a><ul class=\"dropdown-menu\"><li class=\"user-header\"><img src=\"dist/img/user2-160x160.jpg\" class=\"img-circle\" alt=\"User Image\"><p>Alexander Pierce - Web Developer <small>Member since Nov. 2012</small></p></li><li class=\"user-body\"><div class=\"row\"><div class=\"col-xs-4 text-center\"><a href=\"#\">Followers</a></div><div class=\"col-xs-4 text-center\"><a href=\"#\">Sales</a></div><div class=\"col-xs-4 text-center\"><a href=\"#\">Friends</a></div></div></li><li class=\"user-footer\"><div class=\"pull-left\"><a href=\"#\" class=\"btn btn-default btn-flat\">Profile</a></div><div class=\"pull-right\"><a href=\"#\" class=\"btn btn-default btn-flat\">Sign out</a></div></li></ul></li><li><a href=\"#\" data-toggle=\"control-sidebar\"><i class=\"fa fa-gears\"></i></a></li></ul></div></nav></header><aside class=\"main-sidebar\"><section class=\"sidebar\"><div class=\"user-panel\"><div class=\"pull-left image\"><img src=\"dist/img/user2-160x160.jpg\" class=\"img-circle\" alt=\"User Image\"></div><div class=\"pull-left info\"><p>Alexander Pierce</p><a href=\"#\"><i class=\"fa fa-circle text-success\"></i> Online</a></div></div><form action=\"#\" method=\"get\" class=\"sidebar-form\"><div class=\"input-group\"><input type=\"text\" name=\"q\" class=\"form-control\" placeholder=\"Search...\"> <span class=\"input-group-btn\"><button type=\"submit\" name=\"search\" id=\"search-btn\" class=\"btn btn-flat\"><i class=\"fa fa-search\"></i></button></span></div></form><ul class=\"sidebar-menu\"><li class=\"header\">MAIN NAVIGATION</li><li class=\"active treeview\"><a href=\"#\"><i class=\"fa fa-dashboard\"></i> <span>Dashboard</span> <span class=\"pull-right-container\"><i class=\"fa fa-angle-left pull-right\"></i></span></a><ul class=\"treeview-menu\"><li><a href=\"index.html\"><i class=\"fa fa-circle-o\"></i> Dashboard v1</a></li><li class=\"active\"><a href=\"index2.html\"><i class=\"fa fa-circle-o\"></i> Dashboard v2</a></li></ul></li><li class=\"treeview\"><a href=\"#\"><i class=\"fa fa-files-o\"></i> <span>Layout Options</span> <span class=\"pull-right-container\"><span class=\"label label-primary pull-right\">4</span></span></a><ul class=\"treeview-menu\"><li><a href=\"pages/layout/top-nav.html\"><i class=\"fa fa-circle-o\"></i> Top Navigation</a></li><li><a href=\"pages/layout/boxed.html\"><i class=\"fa fa-circle-o\"></i> Boxed</a></li><li><a href=\"pages/layout/fixed.html\"><i class=\"fa fa-circle-o\"></i> Fixed</a></li><li><a href=\"pages/layout/collapsed-sidebar.html\"><i class=\"fa fa-circle-o\"></i> Collapsed Sidebar</a></li></ul></li><li><a href=\"pages/widgets.html\"><i class=\"fa fa-th\"></i> <span>Widgets</span> <span class=\"pull-right-container\"><small class=\"label pull-right bg-green\">new</small></span></a></li><li class=\"treeview\"><a href=\"#\"><i class=\"fa fa-pie-chart\"></i> <span>Charts</span> <span class=\"pull-right-container\"><i class=\"fa fa-angle-left pull-right\"></i></span></a><ul class=\"treeview-menu\"><li><a route-href=\"route: spiritvms\"><i class=\"fa fa-circle-o\"></i> ChartJS</a></li><li><a route-href=\"route: spiritbuilds\"><i class=\"fa fa-circle-o\"></i> Morris</a></li><li><a href=\"pages/charts/flot.html\"><i class=\"fa fa-circle-o\"></i> Flot</a></li><li><a href=\"pages/charts/inline.html\"><i class=\"fa fa-circle-o\"></i> Inline charts</a></li></ul></li><li class=\"treeview\"><a href=\"#\"><i class=\"fa fa-laptop\"></i> <span>UI Elements</span> <span class=\"pull-right-container\"><i class=\"fa fa-angle-left pull-right\"></i></span></a><ul class=\"treeview-menu\"><li><a href=\"pages/UI/general.html\"><i class=\"fa fa-circle-o\"></i> General</a></li><li><a href=\"pages/UI/icons.html\"><i class=\"fa fa-circle-o\"></i> Icons</a></li><li><a href=\"pages/UI/buttons.html\"><i class=\"fa fa-circle-o\"></i> Buttons</a></li><li><a href=\"pages/UI/sliders.html\"><i class=\"fa fa-circle-o\"></i> Sliders</a></li><li><a href=\"pages/UI/timeline.html\"><i class=\"fa fa-circle-o\"></i> Timeline</a></li><li><a href=\"pages/UI/modals.html\"><i class=\"fa fa-circle-o\"></i> Modals</a></li></ul></li><li class=\"treeview\"><a href=\"#\"><i class=\"fa fa-edit\"></i> <span>Forms</span> <span class=\"pull-right-container\"><i class=\"fa fa-angle-left pull-right\"></i></span></a><ul class=\"treeview-menu\"><li><a href=\"pages/forms/general.html\"><i class=\"fa fa-circle-o\"></i> General Elements</a></li><li><a href=\"pages/forms/advanced.html\"><i class=\"fa fa-circle-o\"></i> Advanced Elements</a></li><li><a href=\"pages/forms/editors.html\"><i class=\"fa fa-circle-o\"></i> Editors</a></li></ul></li><li class=\"treeview\"><a href=\"#\"><i class=\"fa fa-table\"></i> <span>Tables</span> <span class=\"pull-right-container\"><i class=\"fa fa-angle-left pull-right\"></i></span></a><ul class=\"treeview-menu\"><li><a href=\"pages/tables/simple.html\"><i class=\"fa fa-circle-o\"></i> Simple tables</a></li><li><a href=\"pages/tables/data.html\"><i class=\"fa fa-circle-o\"></i> Data tables</a></li></ul></li><li><a href=\"pages/calendar.html\"><i class=\"fa fa-calendar\"></i> <span>Calendar</span> <span class=\"pull-right-container\"><small class=\"label pull-right bg-red\">3</small> <small class=\"label pull-right bg-blue\">17</small></span></a></li><li><a href=\"pages/mailbox/mailbox.html\"><i class=\"fa fa-envelope\"></i> <span>Mailbox</span> <span class=\"pull-right-container\"><small class=\"label pull-right bg-yellow\">12</small> <small class=\"label pull-right bg-green\">16</small> <small class=\"label pull-right bg-red\">5</small></span></a></li><li class=\"treeview\"><a href=\"#\"><i class=\"fa fa-folder\"></i> <span>Examples</span> <span class=\"pull-right-container\"><i class=\"fa fa-angle-left pull-right\"></i></span></a><ul class=\"treeview-menu\"><li><a href=\"pages/examples/invoice.html\"><i class=\"fa fa-circle-o\"></i> Invoice</a></li><li><a href=\"pages/examples/profile.html\"><i class=\"fa fa-circle-o\"></i> Profile</a></li><li><a href=\"pages/examples/login.html\"><i class=\"fa fa-circle-o\"></i> Login</a></li><li><a href=\"pages/examples/register.html\"><i class=\"fa fa-circle-o\"></i> Register</a></li><li><a href=\"pages/examples/lockscreen.html\"><i class=\"fa fa-circle-o\"></i> Lockscreen</a></li><li><a href=\"pages/examples/404.html\"><i class=\"fa fa-circle-o\"></i> 404 Error</a></li><li><a href=\"pages/examples/500.html\"><i class=\"fa fa-circle-o\"></i> 500 Error</a></li><li><a href=\"pages/examples/blank.html\"><i class=\"fa fa-circle-o\"></i> Blank Page</a></li><li><a href=\"pages/examples/pace.html\"><i class=\"fa fa-circle-o\"></i> Pace Page</a></li></ul></li><li class=\"treeview\"><a href=\"#\"><i class=\"fa fa-share\"></i> <span>Multilevel</span> <span class=\"pull-right-container\"><i class=\"fa fa-angle-left pull-right\"></i></span></a><ul class=\"treeview-menu\"><li><a href=\"#\"><i class=\"fa fa-circle-o\"></i> Level One</a></li><li><a href=\"#\"><i class=\"fa fa-circle-o\"></i> Level One <span class=\"pull-right-container\"><i class=\"fa fa-angle-left pull-right\"></i></span></a><ul class=\"treeview-menu\"><li><a href=\"#\"><i class=\"fa fa-circle-o\"></i> Level Two</a></li><li><a href=\"#\"><i class=\"fa fa-circle-o\"></i> Level Two <span class=\"pull-right-container\"><i class=\"fa fa-angle-left pull-right\"></i></span></a><ul class=\"treeview-menu\"><li><a href=\"#\"><i class=\"fa fa-circle-o\"></i> Level Three</a></li><li><a href=\"#\"><i class=\"fa fa-circle-o\"></i> Level Three</a></li></ul></li></ul></li><li><a href=\"#\"><i class=\"fa fa-circle-o\"></i> Level One</a></li></ul></li><li><a href=\"documentation/index.html\"><i class=\"fa fa-book\"></i> <span>Documentation</span></a></li><li class=\"header\">LABELS</li><li><a href=\"#\"><i class=\"fa fa-circle-o text-red\"></i> <span>Important</span></a></li><li><a href=\"#\"><i class=\"fa fa-circle-o text-yellow\"></i> <span>Warning</span></a></li><li><a href=\"#\"><i class=\"fa fa-circle-o text-aqua\"></i> <span>Information</span></a></li></ul></section></aside><div class=\"content-wrapper\"><section class=\"content\"><slot name=\"main-content\"></slot></section></div><footer class=\"main-footer\"><div class=\"pull-right hidden-xs\"><b>Version</b> 2.3.12</div><strong>Copyright &copy; 2014-2016 <a href=\"http://almsaeedstudio.com\">Almsaeed Studio</a>.</strong> All rights reserved.</footer></div></template>"; });
define('text!modules/spirit/builds.html', ['module'], function(module) { module.exports = "<template><div slot=\"main-content\"><ej-grid e-data-source.two-way=\"builds\" e-allow-paging=\"true\" e-allow-sorting=\"true\" e-edit-settings.bind=\"edit\" e-toolbar-settings.bind=\"toolbar\" e-page-settings-page-size=\"20\" e-on-end-edit.delegate=\"afterEdit($event.detail)\" e-on-end-add.delegate=\"afterAdd($event.detail)\" e-on-end-delete.delegate=\"afterDelete($event.detail)\" e-on-record-click.delegate=\"recordClick($event.detail)\"><ej-column e-field=\"_id\" e-visible=\"false\" e-is-primary-key=\"true\"></ej-column><ej-column e-field=\"_rev\" e-visible=\"false\"></ej-column><ej-column e-field=\"doc_type\" e-visible=\"false\"></ej-column><ej-column e-field=\"version\" e-header-text=\"Version\" e-text-align=\"left\" e-width=\"170\"></ej-column><ej-column e-field=\"build_date\" e-header-text=\"Build Date\" e-format=\"{0:MM/dd/yyyy}\" e-text-align=\"left\" e-width=\"85\"></ej-column><ej-column e-field=\"stories\" e-header-text=\"Stories\" e-width=\"200\"></ej-column><ej-column e-field=\"spirit\" e-header-text=\"Spirit\" e-text-align=\"left\" e-width=\"60\"></ej-column><ej-column e-field=\"swem\" e-header-text=\"WEM\" e-text-align=\"left\" e-width=\"60\"></ej-column><ej-column e-field=\"time_entry_task\" e-header-text=\"BigTime\" e-text-align=\"left\" e-width=\"300\"></ej-column><ej-column e-field=\"location\" e-header-text=\"Location\" e-text-align=\"left\"></ej-column></ej-grid></div></template>"; });
define('text!modules/spirit/vms.html', ['module'], function(module) { module.exports = "<template><div slot=\"main-content\"><h3>SPIRIT VMs</h3><ej-grid e-data-source.two-way=\"resources\" e-allow-paging=\"true\" e-allow-sorting=\"true\" e-edit-settings.bind=\"edit\" e-toolbar-settings.bind=\"toolbar\" e-page-settings-page-size=\"20\" e-on-end-edit.delegate=\"afterEdit($event.detail)\" e-on-end-add.delegate=\"afterAdd($event.detail)\" e-on-end-delete.delegate=\"afterDelete($event.detail)\" e-on-record-click.delegate=\"recordClick($event.detail)\"><ej-column e-field=\"_id\" e-visible=\"false\" e-is-primary-key=\"true\"></ej-column><ej-column e-field=\"_rev\" e-visible=\"false\"></ej-column><ej-column e-field=\"resource_type_id\" e-header-text=\"Resource Type\" e-text-align=\"left\"></ej-column><ej-column e-field=\"resource_name\" e-header-text=\"Resource\" e-text-align=\"left\"></ej-column><ej-column e-field=\"default_url\" e-header-text=\"URL\"></ej-column><ej-column e-field=\"purpose\" e-header-text=\"Purpose\" e-text-align=\"left\"></ej-column><ej-column e-field=\"record_status_id\" e-header-text=\"Status\" e-text-align=\"left\"></ej-column></ej-grid></div></template>"; });
//# sourceMappingURL=app-bundle.js.map