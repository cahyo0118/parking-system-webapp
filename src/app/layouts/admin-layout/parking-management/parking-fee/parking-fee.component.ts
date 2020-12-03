import { APIService } from './../../../../service/api.service';
import { SimplePageable } from './../../../../model/simple-pageable';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-parking-fee',
  templateUrl: './parking-fee.component.html',
  styleUrls: ['./parking-fee.component.css']
})
export class ParkingFeeComponent implements OnInit {

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
      name: 'vehicle_type',
      display_name: 'Vehicle Type',
      validators: [
        'required'
      ]
    },
    {
      name: 'parking_fee',
      display_name: 'Parking Fee',
      validators: []
    },
    // {
    //   name: 'created_at',
    //   display_name: 'Updated at',
    //   validators: []
    // },
  ];

  menu = {
    name: 'parking-fee-list',
    display_name: 'Parking Fee',
    icon: 'fas fa-money-bill-wave'
  };

  formMotorBikes: FormGroup;
  formCars: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: APIService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe(
      routeData => {
        this.pageData = routeData;
        // this.orderBy = routeData.visibleFields[0].name;
      }
    );

    // this.orderBy = this.visibleFields[0].name;
    this.orderBy = 'id';
    this.orderType = 'desc';

    this.initForm();

    this.activatedRoute.queryParams.subscribe(
      queryParams => {
        this.getAll();
      }
    );

    this.getFeeByVehicleType('motorbikes');
    this.getFeeByVehicleType('cars');

  }

  getAll() {
    this.showLoader = true;

    const requestData = JSON.parse(JSON.stringify(this.searchForm.value));

    this.apiService.get(
      `api/parking-fees`,
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

  getFeeByVehicleType(vehicle_type) {

    this.apiService.get(
      `api/parking-fees/get-by-vehicle-type/${vehicle_type}`
    ).then(
      response => {

        const responseBody = response.data.body;

        console.log('responseBody', responseBody);

        switch (vehicle_type) {
          case 'motorbikes':
            this.formMotorBikes.controls.parking_fee.setValue(responseBody.parking_fee);
            break;
          case 'cars':
            this.formCars.controls.parking_fee.setValue(responseBody.parking_fee);
            break;

        }

      },
      error => {
      }
    );
  }

  onSubmitByVehicleType(vehicle_type) {
    Swal.fire({
      title: 'Submit data?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
    }).then((result) => {

      if (result.value) {

        let requestData = null;

        switch (vehicle_type) {
          case 'motorbikes':
            requestData = JSON.parse(JSON.stringify(this.formMotorBikes.value));
            break;
          case 'cars':
            requestData = JSON.parse(JSON.stringify(this.formCars.value));
            break;

        }

        this.spinner.show();
        this.apiService.put(
          `api/parking-fees/update-by-vehicle-type/${vehicle_type}`,
          requestData
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
              'Failed!',
              error.response.data.message,
              'error'
            );
          }
        );

      }

    });
  }

  initForm() {
    this.searchForm = this.formBuilder.group({
      'keyword': [''],
    });

    this.formMotorBikes = this.formBuilder.group({
      'parking_fee': ['', [Validators.required]],
    });

    this.formCars = this.formBuilder.group({
      'parking_fee': ['', [Validators.required]],
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

}
