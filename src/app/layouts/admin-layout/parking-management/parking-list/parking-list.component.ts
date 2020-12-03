import { APIService } from './../../../../service/api.service';
import { SimplePageable } from './../../../../model/simple-pageable';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-parking-list',
  templateUrl: './parking-list.component.html',
  styleUrls: ['./parking-list.component.css']
})
export class ParkingListComponent implements OnInit {

  showLoader: boolean = false;
  items = [];
  pageable: SimplePageable = new SimplePageable;
  pageData: any;

  searchForm: FormGroup;
  filterForm: FormGroup;
  visibleFieldForm: FormGroup;

  orderBy: any;
  orderType: 'asc' | 'desc' = 'desc';

  vehicle_types = [
    { id: 'motorbikes', name: 'Motorbikes' },
    { id: 'cars', name: 'Cars' }
  ];

  visibleFields = [
    {
      name: 'code',
      display_name: 'Code',
      validators: [
        'required'
      ]
    },
    {
      name: 'vehicle_police_number',
      display_name: 'Vehicle Police Number',
      validators: []
    },
    {
      name: 'parking_fee',
      display_name: 'Parking Fee',
      validators: []
    },
  ];

  menu = {
    name: 'parking-list',
    display_name: 'Parking List',
    icon: 'fas fa-parking'
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: APIService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private parserFormatter: NgbDateParserFormatter,
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

    this.initForm();

    this.activatedRoute.queryParams.subscribe(
      queryParams => {
        this.getAll();
      }
    );

  }

  getAll() {
    this.showLoader = true;

    const requestData = JSON.parse(JSON.stringify(this.searchForm.value));
    const filterData = JSON.parse(JSON.stringify(this.filterForm.value));
    filterData.start_date = this.parserFormatter.format(this.filterForm.value.start_date);
    filterData.finish_date = this.parserFormatter.format(this.filterForm.value.finish_date);

    this.apiService.get(
      `api/parkings`,
      {
        params: {
          keyword: requestData.keyword,
          filters: filterData,
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

    this.filterForm = this.formBuilder.group({
      'vehicle_type': [''],
      'start_date': [''],
      'finish_date': [''],
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

  onDelete(id) {

    Swal.fire({
      title: 'Delete data?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
    }).then((result) => {

      if (result.value) {

        this.spinner.show();
        this.apiService.delete(
          `api/parkings/${id}/delete`,
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
              'Failed!',
              error.response.data.message,
              'error'
            );
          }
        );

      }

    });

  }

  onExportExcel() {

    const requestData = JSON.parse(JSON.stringify(this.searchForm.value));
    const filterData = JSON.parse(JSON.stringify(this.filterForm.value));
    filterData.start_date = this.parserFormatter.format(this.filterForm.value.start_date);
    filterData.finish_date = this.parserFormatter.format(this.filterForm.value.finish_date);

    this.spinner.show();
    this.apiService.get(
      `api/parkings/export`,
      {
        responseType: 'blob',
        params: {
          keyword: requestData.keyword,
          filters: filterData,
          limit: this.pageable.limit,
          offset: this.pageable.offset,
          orderBy: this.orderBy,
          orderType: this.orderType,
        }
      }
    ).then(
      response => {
        this.spinner.hide();

        saveAs(response.data, `parking[${filterData.start_date}-${filterData.finish_date}].xlsx`)

      },
      error => {
        this.spinner.hide();
      }
    );
  }

}
