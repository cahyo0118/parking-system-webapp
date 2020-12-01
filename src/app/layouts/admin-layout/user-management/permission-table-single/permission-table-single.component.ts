import { Environment } from './../../../../config/environment';
import { ActivatedRoute } from '@angular/router';
import { APIService } from './../../../../service/api.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-permission-table-single',
  templateUrl: './permission-table-single.component.html',
  styleUrls: ['./permission-table-single.component.css']
})
export class PermissionTableSingleComponent implements OnInit {

  id: any;

  data: any;

  showLoader: boolean = false;

  menu = {
    name: 'permission-table-list',
    display_name: 'Permission',
    icon: 'fas fa-tasks'
  };

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

    if (params.permission_id) {

      this.id = params.permission_id;

      this.getData();

    }

  }

  getData() {
    this.apiService.get(
      `api/permissions/${this.id}/detail`
    ).then(
      response => {
        const responseBody = response.data.body;

        this.data = responseBody;
      }
    );
  }

}
