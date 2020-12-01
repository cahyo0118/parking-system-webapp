import { Environment } from './../../../../config/environment';
import { APIService } from './../../../../service/api.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tenant-single',
  templateUrl: './tenant-single.component.html',
  styleUrls: ['./tenant-single.component.css']
})
export class TenantSingleComponent implements OnInit {

  id: any;

  data: any;

  showLoader: boolean = false;

  menu = {
    name: 'tenant-list',
    display_name: 'Tenant',
    icon: 'fas fa-building'
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: APIService,
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
    }

  }

  getData() {
    this.apiService.get(
      `api/tenant/${this.id}/detail`
    ).then(
      response => {
        const responseBody = response.data.body;

        this.data = responseBody;
      }
    );
  }

}
