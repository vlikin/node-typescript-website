import {Component, OnInit} from '@angular/core';
import {AdminService} from '../../service/admin';
import {FormBuilder, FormGroup} from '@angular/forms';


@Component({
  selector: 'dmn-page-page-component',
  templateUrl: 'template.html',
  styleUrls: [
    'style.sass'
  ]
})
export class PagePageComponent implements OnInit {
  isProcessing = false;
  state: any;
  languages = this.adminService.languages;
  form!: FormGroup;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.form = this.buildForm();
    console.log(this.form);
  }

  startProcessing() {
    this.isProcessing = true;
  }

  stopProcessing() {
    this.isProcessing = false;
  }

  save() {
    this.startProcessing();
    this.state = this.form.getRawValue();
    this.adminService.adminPageSetHttp(this.state)
      .subscribe(() => {
        this.adminService.showMessage('The page has been saved successfully!');
        this.stopProcessing();
      },
        (error) => {
        this.stopProcessing();
        this.adminService.showMessage('Some error has occurred!', 'error');
       });
  }

  ngOnInit(): void {
    this.adminService.adminPageGetHttp()
      .subscribe(({state}) => {
        this.state = state;
        this.form.patchValue(this.state);
        console.log(this.state);
      });
  }

  buildForm(): FormGroup {
    const form = {
      component: this.fb.group({
        header: this.buildHeaderComponentForm(),
        footer: this.buildFooterComponentForm()
      }),
      section: this.fb.group({
        hero: this.buildHeroSectionForm(),
        aboutMe: this.buildAboutMeSectionForm(),
        blog: this.buildBlogSectionForm(),
        resume: this.buildResumeSectionForm(),
        services: this.buildServicesSectionForm(),
        contact: this.buildContactsSectionForm()
      })
    };
    return this.fb.group(form);
  }

  buildHeaderComponentForm(): any {
    const translations = {};
    this.languages.forEach((language) => {
      translations[language.key] = this.fb.group({
        lang: this.fb.group({
          en: [''],
          ru: [''],
          uk: ['']
        }),
        'menu': this.fb.group({
          aboutMe: [''],
          blog: [''],
          contact: [''],
          home: [''],
          resume: ['']
        })
      });
    });

    return this.fb.group(translations);
  }

  buildFooterComponentForm(): any {
    const translations = {};
    this.languages.forEach((language) => {
      translations[language.key] = this.fb.group({
        copyright: ['']
      });
    });

    return this.fb.group(translations);
  }

  buildAboutMeSectionForm(): any {
    const translations = {};
    this.languages.forEach((language) => {
      translations[language.key] = this.fb.group({
        title: [''],
        subtitle: [''],
        personal: [''],
        professional: ['']
      });
    });

    return this.fb.group(translations);
  }

  buildBlogSectionForm(): any {
    const translations = {};
    this.languages.forEach((language) => {
      translations[language.key] = this.fb.group({
        title: [''],
        call_to_action: this.fb.group({
          title: [''],
          href: ['']
        })
      });
    });

    return this.fb.group(translations);
  }

  buildResumeSectionForm(): any {
    const translations = {};
    this.languages.forEach((language) => {
      translations[language.key] = this.fb.group({
        title: [''],
        call_to_action: this.fb.group({
          title: [''],
          href: ['']
        })
      });
    });

    return this.fb.group(translations);
  }

  buildServicesSectionForm(): any {
    const translations = {};
    this.languages.forEach((language) => {
      translations[language.key] = this.fb.group({
        title: [''],
        services: this.fb.group({
          design: this.fb.group({
            title: [''],
            content: ['']
          }),
          prototype: this.fb.group({
            title: [''],
            content: ['']
          }),
          web_app: this.fb.group({
            title: [''],
            content: ['']
          }),
          mobile_app: this.fb.group({
            title: [''],
            content: ['']
          }),
          dev_ops: this.fb.group({
            title: [''],
            content: ['']
          }),
          qa: this.fb.group({
            title: [''],
            content: ['']
          })
        })
      });
    });

    return this.fb.group(translations);
  }

  buildHeroSectionForm(): any {
    const translations = {};
    this.languages.forEach((language) => {
      translations[language.key] = this.fb.group({
        fullname: [''],
        position: [''],
        button: ['']
      });
    });

    return this.fb.group(translations);
  }

  buildContactsSectionForm(): any {
    const translations = {};
    this.languages.forEach((language) => {
      translations[language.key] = this.fb.group({
        title: [''],
        subtitle: [''],
        personal: ['']
      });
    });

    return this.fb.group(translations);
  }

}
