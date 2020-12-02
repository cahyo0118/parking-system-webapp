import { Environment } from './../../../../config/environment';
import { ActivatedRoute } from '@angular/router';
import { APIService } from './../../../../service/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RolePermissionComponent } from '../role-permission/role-permission.component';

@Component({
  selector: 'app-role-single',
  templateUrl: './role-single.component.html',
  styleUrls: ['./role-single.component.css']
})
export class RoleSingleComponent implements OnInit {

  id: any;

  data: any;

  showLoader: boolean = false;

  menu = {
    name: 'role-list',
    display_name: 'Role',
    icon: 'fas fa-user-tag'
  };

  @ViewChild('role_permission') role_permission_component: RolePermissionComponent;

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
      `api/roles/${this.id}/detail`,
      {
        params: {
          with: ['permissions']
        }
      }
    ).then(
      response => {
        const responseBody = response.data.body;

        this.data = responseBody;

        this.role_permission_component.setData(this.data);
      }
    );
  }

}
