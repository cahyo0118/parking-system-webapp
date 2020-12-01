import { Environment } from './../../../../config/environment';
import { FileUploadService } from './../../../../service/file-upload.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { APIService } from './../../../../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-community-form',
  templateUrl: './community-form.component.html',
  styleUrls: ['./community-form.component.css']
})
export class CommunityFormComponent implements OnInit {

  id: any;

  categories = [];
  categoriesShowLoader: boolean = false;

  showLoader: boolean = false;
  items = [];
  pageData: any;

  form: FormGroup;
  visibleFieldForm: FormGroup;
  visibleFields = [];

  actions = [];

  isUpdate: boolean = false;

  // Files
  photoPreview: any;
  photoUploadProgress: any = 0;


  menu = {
    name: 'community-form',
    display_name: 'Komunitas',
    icon: 'fas fa-users'
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: APIService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private location: Location,
    private parserFormatter: NgbDateParserFormatter,
    private fileUploadService: FileUploadService,
    public env: Environment,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe(
      routeData => {
        console.log('routeData', routeData);
        this.pageData = routeData;
      }
    );

    this.initForm();

    this.getCategoriesDataSet();

    const params = this.activatedRoute.snapshot.params;

    if (params.id) {
      this.isUpdate = true;
      this.id = params.id;

      this.getData();
    } else {
      this.isUpdate = false;
    }

  }

  initForm() {

    this.form = this.formBuilder.group({
      photo: ['', []],
      name: ['', [Validators.required]],
      description: ['', []],
      communityCategoryId: ['', [Validators.required]],
      type: ['private', [Validators.required]],
      visibility: ['show', [Validators.required]],
      website: ['', []],
      googlePlaceId: ['', []],
      dateBirth: ['', []],
    });

  }

  getData() {
    this.apiService.get(
      `api/community/${this.id}/detail`
    ).then(
      response => {
        const responseBody = response.data.body;

        this.form.patchValue(responseBody);

        this.form.controls.dateBirth.setValue(
          this.parserFormatter.parse(this.form.controls.dateBirth.value)
        );
      }
    );
  }

  getCategoriesDataSet() {
    this.categoriesShowLoader = true;

    this.apiService.get(
      `api/community/data-set/categories`,
      {
        params: {
          // keyword: requestData.keyword,
          // limit: this.pageable.limit,
          // offset: this.pageable.offset,
          // orderBy: this.orderBy,
          // orderType: this.orderType,
        }
      }
    ).then(
      response => {
        this.categoriesShowLoader = false;

        const responseBody = response.data.body;
        console.log('responseBody', responseBody);

        this.categories = responseBody;
      },
      error => {
        this.categoriesShowLoader = false;
      }
    );
  }

  async onPhotoChange(event: any, formControlName) {

    console.log('formControlName', formControlName);

    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.helpers.presentToast('Only images are supported', 'top');

      Swal.fire({
        title: 'Oops!',
        text: 'Only images are supported',
        icon: 'error',
      });

      return;
    }

    const reader = new FileReader();
    reader.onload = (eventReader: any) => {

      switch (formControlName) {
        case 'photo':
          this.photoPreview = eventReader.target.result;
          break;
      }

      const config = {
        onUploadProgress: function (progressEvent) {

          switch (formControlName) {
            case 'photo':
              this.photoUploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              break;
          }

        }.bind(this)
      };


      this.fileUploadService.uploadPhotoTemp(eventReader.target.result, config).then(
        response => {

          this.photoUploadProgress = 0;

          const responseBody = response.data.body;

          this.form.controls[formControlName].setValue(responseBody.fullPath);

          console.log('this.form.value', this.form.value);

          Swal.fire({
            title: 'Success!',
            text: response.data.message,
            icon: 'success',
            toast: true,
            position: 'top',
            timer: 3000
          });

        },
        error => {
          this.photoUploadProgress = 0;

          Swal.fire({
            title: 'Failed upload file',
            text: error.response.data.message,
            icon: 'error',
          });
        }
      );
    };
    reader.readAsDataURL(event.target.files[0]);


  }

  onDeletePhoto(formControlName) {
    switch (formControlName) {
      case 'photo':
        this.photoPreview = '';
        break;
    }
    this.form.controls[formControlName].setValue('');
  }


  onSubmit() {

    Swal.fire({
      title: 'Submit data?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
    }).then((result) => {

      if (result.value) {

        const requestData = JSON.parse(JSON.stringify(this.form.value));
        requestData.dateBirth = `${this.form.value.dateBirth.year}-${this.form.value.dateBirth.month}-${this.form.value.dateBirth.day}`;

        if (this.isUpdate) {
          this.spinner.show();
          this.apiService.put(
            `api/community/${this.id}/update`,
            requestData
          ).then(
            response => {
              this.spinner.hide();

              Swal.fire(
                'Success!',
                response.data.message,
                'success'
              );

              this.location.back();

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
        } else {
          this.spinner.show();
          this.apiService.post(
            `api/community/store`,
            requestData
          ).then(
            response => {
              this.spinner.hide();

              Swal.fire(
                'Success!',
                response.data.message,
                'success'
              );

              this.location.back();

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
      }

    });

  }

}
