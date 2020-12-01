import { Environment } from './../../../../config/environment';
import { ActivatedRoute } from '@angular/router';
import { APIService } from './../../../../service/api.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-module-single',
  templateUrl: './module-single.component.html',
  styleUrls: ['./module-single.component.css']
})
export class ModuleSingleComponent implements OnInit {

  id: any;

  data: any;

  showLoader: boolean = false;

  menu = {
    name: 'module-list',
    display_name: 'Module',
    icon: 'fas fa-user-tag'
  };

  relationFilters: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: APIService,
    public location: Location,
    public env: Environment,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe(
      routeData => {
        console.log('routeData', routeData);
      }
    );

    const params = this.activatedRoute.snapshot.params;

    if (params.id) {

      this.id = params.id;

      this.getData();

      // Init filters
      this.relationFilters = {
        module_id: this.id
      };

    }

  }

  getData() {
    this.apiService.get(
      `api/modules/${this.id}/detail`
    ).then(
      response => {
        const responseBody = response.data.body;

        this.data = responseBody;
      }
    );
  }

}
