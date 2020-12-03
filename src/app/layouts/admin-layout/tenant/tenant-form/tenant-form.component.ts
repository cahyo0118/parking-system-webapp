import { FileUploadService } from './../../../../service/file-upload.service';
import { Environment } from './../../../../config/environment';
import { APIService } from './../../../../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tenant-form',
  templateUrl: './tenant-form.component.html',
  styleUrls: ['./tenant-form.component.css']
})
export class TenantFormComponent implements OnInit {

  id: any;

  showLoader: boolean = false;
  items = [];
  pageData: any;

  form: FormGroup;
  visibleFieldForm: FormGroup;
  visibleFields = [];

  actions = [];

  isUpdate: boolean = false;

  // Files
  logoPreview: any;
  logoUploadProgress: any = 0;

  menu = {
    name: 'tenant-list',
    display_name: 'Tenant',
    icon: 'fas fa-building'
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: APIService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
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

    const params = this.activatedRoute.snapshot.params;

    if (params.id) {
      this.isUpdate = true;
      this.id = params.id;

      this.form.controls.admin_name.setValidators([]);
      this.form.controls.admin_email.setValidators([]);
      this.form.controls.admin_phone_wa.setValidators([]);
      this.form.controls.admin_password.setValidators([]);

      this.getData();
    } else {
      this.isUpdate = false;
    }

  }

  initForm() {

    this.form = this.formBuilder.group({
      logo: ['', [Validators.required]],
      name: ['', [Validators.required]],
      short_name: ['', [Validators.required]],
      description: ['', []],
      address: ['', []],
      is_verified: ['', []],
      date_verified: ['', []],
      is_active: ['', []],

      admin_name: ['', [Validators.required]],
      admin_email: ['', [Validators.required]],
      admin_phone_wa: ['', [Validators.required]],
      admin_password: ['', [Validators.required]],
    });

  }

  getData() {
    this.apiService.get(
      `api/tenant/${this.id}/detail`
    ).then(
      response => {
        const responseBody = response.data.body;

        this.form.patchValue(responseBody);
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
        case 'logo':
          this.logoPreview = eventReader.target.result;
          break;
      }

      const config = {
        onUploadProgress: function (progressEvent) {

          switch (formControlName) {
            case 'logo':
              this.logoUploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              break;
          }

        }.bind(this)
      };


      this.fileUploadService.uploadPhotoTemp(eventReader.target.result, config).then(
        response => {

          this.logoUploadProgress = 0;

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
          this.logoUploadProgress = 0;

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
      case 'logo':
        this.logoPreview = '';
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

        if (this.isUpdate) {
          this.spinner.show();
          this.apiService.put(
            `api/tenant/${this.id}/update`,
            requestData
          ).then(
            response => {
              this.spinner.hide();

              Swal.fire(
                'Success!',
                response.data.message,
                'success'
              );

              this.router.navigate(['/admin/tenant-management/tenant']);

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
        } else {
          this.spinner.show();
          this.apiService.post(
            `api/tenant/store`,
            requestData
          ).then(
            response => {
              this.spinner.hide();

              Swal.fire(
                'Success!',
                response.data.message,
                'success'
              );

              this.router.navigate(['/admin/tenant-management/tenant']);

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
      }

    });

  }


}
