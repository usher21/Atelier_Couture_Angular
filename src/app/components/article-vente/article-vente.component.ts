import { Component, OnInit, ViewChild } from '@angular/core';
import { ArticleVente } from 'src/app/models/ArticleVente';
import { ArticleVenteData, JsonResponse, Pagination } from 'src/app/models/JsonResponse';
import { ArticleVenteService } from 'src/app/services/article-vente.service';
import { FormArticleVenteComponent } from './form-article-vente/form-article-vente.component';

@Component({
	selector: 'app-article-vente',
	templateUrl: './article-vente.component.html',
	styleUrls: ['./article-vente.component.css']
})
export class ArticleVenteComponent implements OnInit {
	response: Pagination<ArticleVente[]> = <Pagination<ArticleVente[]>>{};
	articleVenteData: ArticleVenteData = <ArticleVenteData>{};
	@ViewChild(FormArticleVenteComponent) articleVenteComponent: FormArticleVenteComponent = <FormArticleVenteComponent>{}

	constructor(private articleVenteService: ArticleVenteService) { }

	ngOnInit(): void {
		this.articleVenteService.all<JsonResponse<ArticleVenteData>>("data").subscribe({
			next: (response) => {
				this.articleVenteData = response.data as ArticleVenteData;
			}
		});
		this.articleVenteService.paginate<Pagination<ArticleVente[]>>(this.response.per_page ?? 5).subscribe({
			next: (response) => {
				this.response = response
			},
		});
	}

	onAddArticleVente(formData: FormData) {
		this.articleVenteService.create<FormData>(formData).subscribe({
			next: (response) => {
				if (Array.isArray(response.data)) {
					this.response.data.unshift(response.data[0]);
					this.articleVenteComponent.articleVenteForm.reset();
				}
			},
		})
	}
}
