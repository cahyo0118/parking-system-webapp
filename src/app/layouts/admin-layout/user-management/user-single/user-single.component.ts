import { Environment } from './../../../../config/environment';
import { ActivatedRoute } from '@angular/router';
import { APIService } from './../../../../service/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-single',
  templateUrl: './user-single.component.html',
  styleUrls: ['./user-single.component.css']
})
export class UserSingleComponent implements OnInit {

  id: any;

  data: any;

  showLoader: boolean = false;

  menu = {
    name: 'user-list',
    display_name: 'User',
    icon: 'fas fa-users'
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
      `api/users/${this.id}/detail`
    ).then(
      response => {
        this.data = response.data.body;
      }
    );
  }

}
