import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from './../../../../../../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SimplePageable } from './../../../../../../model/simple-pageable';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-community-table',
  templateUrl: './community-table.component.html',
  styleUrls: ['./community-table.component.css']
})
export class CommunityTableComponent implements OnInit {

  tenantId: any;

  showLoader: boolean = false;
  items = [];
  pageable: SimplePageable = new SimplePageable;
  pageData: any;

  searchForm: FormGroup;
  visibleFieldForm: FormGroup;

  orderBy: any;
  orderType: 'asc' | 'desc' = 'desc';

  visibleFields = [
    {
      name: 'name',
      display_name: 'Name',
      validators: [
        'required'
      ]
    },
    {
      name: 'is_verified',
      display_name: 'Is Verified',
      validators: []
    },
  ];

  menu = {
    name: 'community-table',
    display_name: 'Community',
    icon: 'fas fa-users'
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: APIService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.parent.params.subscribe(
      routerData => {
        console.log('routerData', routerData);
      }
    )

    this.activatedRoute.data.subscribe(
      routeData => {

        console.log('routeData', routeData);

        this.pageData = routeData;
      }
    );

    const params = this.activatedRoute.snapshot.params;
    console.log('params', params);

    if (params.id) {
      this.tenantId = params.id;
    }

    this.orderBy = this.visibleFields[0].name;

    this.initForm();

    this.activatedRoute.queryParams.subscribe(
      queryParams => {
        this.getAll(Number(queryParams.offset) + Number(this.pageable.limit));
      }
    );

  }

  getAll(offset = this.pageable.offset) {
    this.showLoader = true;

    const requestData = JSON.parse(JSON.stringify(this.searchForm.value));

    if (offset) {

    }

    this.apiService.get(
      `api/tenant/${this.tenantId}/relations/community`,
      {
        params: {
          keyword: requestData.keyword,
          limit: this.pageable.limit,
          offset: this.pageable.offset,
          orderBy: this.orderBy,
          orderType: this.orderType,
        }
      }
    ).then(
      response => {
        this.showLoader = false;

        this.items = response.data.body;

        this.pageable.setValue(
          this.pageable.limit,
          this.pageable.offset,
          response.data.form,
          response.data.to,
          response.data.total,
        );

      },
      error => {
        this.showLoader = false;
      }
    );
  }

  initForm() {
    this.searchForm = this.formBuilder.group({
      'keyword': [''],
    });

    if (this.visibleFields) {

      this.visibleFieldForm = this.formBuilder.group({});

      this.visibleFields.forEach(visibleField => {
        this.visibleFieldForm.addControl(visibleField.name, new FormControl(true, []));
      });

    }
  }

  initQueryParams() {
    this.router.navigate(
      ['.'],
      {
        relativeTo: this.activatedRoute,
        queryParams: this.pageable,
      }
    );
  }

  toggleOrder(fieldName) {

    if (this.orderBy == fieldName) {
      this.orderType = (this.orderType == 'desc') ? 'asc' : 'desc';
    }

    this.orderBy = fieldName;

    this.initQueryParams();

    this.getAll();

  }

  goToPreviousPage() {
    this.pageable.goPrevious();
    this.initQueryParams();
  }

  goToFirstPage() {
    this.pageable.goFirst();
    this.initQueryParams();
  }

  goToNextPage() {
    this.pageable.goNext();
    this.initQueryParams();
  }

  goToLastPage() {
    // this.pageable.goNext();
  }

  goCustom(page: number) {
    this.pageable.goCustom(page);
    this.initQueryParams();
  }

  onVisibilityChange() {
    console.log('onVisibilityChange-formValue', this.visibleFieldForm.value);
    console.log('onVisibilityChange-get', this.visibleFieldForm.controls['name'].value);
  }

  onDelete(communityId) {

    Swal.fire({
      title: 'Delete data?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
    }).then((result) => {

      if (result.value) {

        this.spinner.show();
        this.apiService.delete(
          `api/tenant/${this.tenantId}/relations/community/${communityId}/delete`,
          null
        ).then(
          response => {
            this.spinner.hide();

            Swal.fire(
              'Success!',
              response.data.message,
              'success'
            );

            this.getAll();

          },
          error => {
            this.spinner.hide();

            Swal.fire(
              'Error!',
              error.response.data.message,
              'error'
            );
          }
        );

      }

    });

  }

}
