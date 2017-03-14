
import { inject } from 'aurelia-framework';
//import * as AutoMapper from 'automapper-ts';
import * as PouchDB from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';
PouchDB.plugin(PouchDBFind);

export class rmsbuilds {
    public builds: Build[];
    edit = { allowEditing: true, allowAdding: true, allowDeleting: true, editMode : "normal", showAddNewRow : true };
    toolbar = { showToolbar: true, toolbarItems: [ "add", "edit", "delete", "update", "cancel" ] }; // , toolbarItems: [ej.Grid.ToolBarItems.Add, ej.Grid.ToolBarItems.Edit, ej.Grid.ToolBarItems.Delete, ej.Grid.ToolBarItems.Update, ej.Grid.ToolBarItems.Cancel] 
    //remoteCouch = 'https://earivensparthedeoulinera:55ca5146d328c0ed4b98f418c0ad3e77771ecebd@archaeology.cloudant.com/resman';
    remoteCouch = 'http://resman_web:resman_web@kydevbuild01.cdps.cdp:5984/resman';
    doc_type: string = 'spirit_build';

    db = new PouchDB('resman');

    constructor() {
        this.loadBuilds();

        // make sure the doc_type index exists
        // this.db.createIndex({
        //   index: {fields: ['doc_type']}
        // }).then((result) => {
        //   this.log(result);
        // }).catch(function (err) {
        //   this.log(err);
        // });

        this.db.sync(this.remoteCouch, {
          live: true
        }).on('change', (change) => {
          // consider grabbing the 'docs' array from the change object 
          // and manually replacing them in the builds array
          this.loadBuilds();
        }).on('error', (err) => {
          console.log(err);
        });
    }

    loadBuilds = () => {   
      // grab all 'spirit_machine docs
      this.db.find({
        selector: { doc_type: this.doc_type }
      }).then((results) => {
        this.builds = results.docs;
      }).catch((err) => {
        this.log(err, true);
      })
    }

    afterEdit(e) {
      this.db.get(e.data._id).then((build) => {

        // set the current values on the existing build
        // find a js automapper!
        build.doc_type = this.doc_type;
        build.build_id = e.data.build_id;
        build.version = e.data.version;
        build.location = e.data.location
        build.stories = e.data.stories;
        build.notify = e.data.notify;
        build.spirit = e.data.spirit;
        build.build_date = e.data.build_date;
        build.time_entry_task = e.data.time_entry_task;

        // save the updated build
        this.db.put(build).catch((err) => {
          this.log(err, true);
        })
      });
    } 

    afterAdd(e) {
      var build: Build = new Build();

      build.doc_type = this.doc_type;
      build.build_id = e.data.build_id;
      build.version = e.data.version;
      build.location = e.data.location
      build.stories = e.data.stories;
      build.notify = e.data.notify;
      build.spirit = e.data.spirit;
      build.build_date = e.data.build_date;
      build.time_entry_task = e.data.time_entry_task;

      this.db.post(build).catch((err) => {
        this.log(err, true);
      });
    }

    afterDelete(e) {
      this.db.get(e.data._id).then((build) => {
        this.db.remove(build._id, build._rev).catch((err) => {
          this.log(err, true);
        });
      });
    }

    log(err: any, showAlert: boolean = false) {
      console.log(err);
      if(showAlert) {
        alert(err);
      }
    }

    recordClick(e) {
      //handle event here
    }
}

export class Build {
    doc_type: string;
    build_id: number;
    version: string;
    location: string;
    stories: string;
    notify: boolean;
    spirit: boolean;
    build_date: string;
    time_entry_task: string;
}



