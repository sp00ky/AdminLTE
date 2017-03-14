
import { inject } from 'aurelia-framework';
//import * as AutoMapper from 'automapper-ts';
import * as PouchDB from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';
PouchDB.plugin(PouchDBFind);

export class rmsvms {
    public resources: Resource[];
    edit = { allowEditing: true, allowAdding: true, allowDeleting: true, editMode : "normal", showAddNewRow : true };
    toolbar = { showToolbar: true, toolbarItems: [ "add", "edit", "delete", "update", "cancel" ] }; // , toolbarItems: [ej.Grid.ToolBarItems.Add, ej.Grid.ToolBarItems.Edit, ej.Grid.ToolBarItems.Delete, ej.Grid.ToolBarItems.Update, ej.Grid.ToolBarItems.Cancel] 
    //remoteCouch = 'https://earivensparthedeoulinera:55ca5146d328c0ed4b98f418c0ad3e77771ecebd@archaeology.cloudant.com/resman';
    remoteCouch = 'http://resman_web:resman_web@kydevbuild01.cdps.cdp:5984/resman';
    doc_type: string = 'spirit_machine';

    db = new PouchDB('resman');

    constructor() {
        this.loadResources();

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
          // and manually replacing them in the resources array
          this.loadResources();
        }).on('error', (err) => {
          console.log(err);
        });
    }

    loadResources = () => {   
      // grab all 'spirit_machine docs
      this.db.find({
        selector: { doc_type: this.doc_type }
      }).then((results) => {
        this.resources = results.docs;
      }).catch((err) => {
        this.log(err, true);
      })
    }

    afterEdit(e) {
      this.db.get(e.data._id).then((resource) => {

        // set the current values on the existing resource
        // find a js automapper!
        resource.doc_type = e.data.doc_type;
        resource.resource_name = e.data.resource_name;
        resource.default_url = e.data.default_url;
        resource.purpose = e.data.purpose;
        resource.resource_type_id = e.data.resource_type_id;
        resource.record_status_id = e.data.record_status_id;

        // save the updated resource
        this.db.put(resource).catch((err) => {
          this.log(err, true);
        })
      });
    } 

    afterAdd(e) {
      var resource: Resource = new Resource();
        resource.doc_type = this.doc_type,
        resource.id = e.data.id,
        resource.resource_name = e.data.resource_name,
        resource.default_url = e.data.default_url,
        resource.purpose = e.data.purpose,
        resource.resource_type_id = e.data.resource_type_id,
        resource.record_status_id = e.data.record_status_id

      this.db.post(resource).catch((err) => {
        this.log(err, true);
      });
    }

    afterDelete(e) {
      this.db.get(e.data._id).then((resource) => {
        this.db.remove(resource._id, resource._rev).catch((err) => {
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

export class Resource {
    id: number;
    doc_type: string;
    resource_id: number;
    project_id: number;
    resource_type_id: string;
    resource_name: string;
    default_url: string;
    purpose: string;
    record_status_id: number;
}


