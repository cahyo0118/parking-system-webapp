import { Environment } from './../../../../config/environment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { APIService } from './../../../../service/api.service';
import { SimplePageable } from './../../../../model/simple-pageable';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

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
      name: 'email',
      display_name: 'Email',
      validators: []
    },
  ];

  closeResult = '';

  importProgress = 0;
  importFilePath: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: APIService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    public env: Environment,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe(
      routeData => {
        this.pageData = routeData;
        // this.orderBy = routeData.visibleFields[0].name;
      }
    );

    this.orderBy = this.visibleFields[0].name;

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

    this.apiService.get(
      `api/users`,
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
          `api/users/${id}/delete`,
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

  open(content) {
    this.modalService.open(
      content,
      {
        ariaLabelledBy: 'modal-basic-title'
      }
    ).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      console.log('by pressing ESC');
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      console.log('by clicking on a backdrop');
      return 'by clicking on a backdrop';
    } else {
      console.log(`with: ${reason}`);
      return `with: ${reason}`;
    }
  }

  uploadFile(event) {

    const requestData = new FormData();
    requestData.append('file', event.target.files[0]);

    this.apiService.uploadFile(
      `api/file-upload/file/temp`,
      requestData,
      {
        onUploadProgress: function (progressEvent) {
          this.importProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('this.importProgress', this.importProgress);
        }.bind(this)
      }
    ).then(
      response => {
        this.importProgress = 0;

        const responseBody = response.data.body;

        console.log('uploadFile-res', response);

        this.importFilePath = responseBody.path;

        Swal.fire({
          title: 'Success!',
          text: response.data.message,
          icon: 'success',
          toast: true,
          position: 'top-end',
          timer: 3000
        });

      },
      error => {
        Swal.fire({
          title: 'Failed upload file',
          text: error.message,
          icon: 'error',
        });
      }
    ).catch(
      err => {
        this.importProgress = 0;

        console.log('err', err);
        Swal.fire({
          title: err.message,
          icon: 'error',
          toast: false,
          confirmButtonText: 'Mengerti'
        });
      }
    );
  }

  onDeleteImportFile() {
    this.importFilePath = '';
  }

  onImportExcel() {

    Swal.fire({
      title: 'Submit data?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
    }).then((result) => {

      if (result.value) {
        this.spinner.show();
        this.apiService.post(
          `api/users/import-excel`,
          {
            filePath: this.importFilePath
          }
        ).then(
          response => {
            this.spinner.hide();
            console.log('onImportExcel-response', response);

            this.importFilePath = '';

            this.getAll();

            Swal.fire({
              title: 'Success!',
              text: response.data.message,
              icon: 'success',
              toast: true,
              position: 'top-end',
            });

          },
          error => {
            this.spinner.hide();
            console.log('onImportExcel-error', error);

            Swal.fire({
              title: error.message,
              text: error.validationErrorMessages.toString(),
              icon: 'error',
              confirmButtonText: 'Mengerti'
            });
          }
        );
      }

    });

  }
}
