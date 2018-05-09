Spécification du Markdown Exodoc
=======================


Les zones de texte cachées
----------------
Ces zones n'apparaissent pas dans le document HTML résultant
```hidden
Bonjour, ce texte ne sera jamais affiché
```
	```hidden
	Bonjour, ce texte ne sera jamais affiché
	```


Les spoilers
---------
Les sections<sup><a href="#">[1]</a></sup> commançant par un titre ayant la classe `spoiler` n'affichent que le titre mais peuvent être révélés en cliquant sur celui-ci.

### Spoiler {.spoiler}
Bonjour, ceci est un spoiler<br/>

---

	### Spoiler {.spoiler}
	Bonjour, ceci est un spoiler
	---

Les zones évaluées
-------------

Ces zones de texte sont évaluées *via* un parser MathJS. Toutes les fonctions disponibles sont documentées [sur cette page](http://mathjs.org/docs/reference/functions.html).

Dans le cas où il y a plusieurs instructions, chacune doit obligatoirement se terminer par un point-virgule. Pour la dernière instruction, le point-virgule est facultatif.
Les caractères `#` marquent des commentaires: rien de ce qui se trouve entre un `#` et la fin de la ligne ne sera exécuté.

```mathjs
x=randomInt(0,5);
x=x+1;
y=round(random(-100,100), 3); #assigne à y un nombre réel entre -100 et 100, arrondi à 3 décimales
z=3
```


	```mathjs
	x=randomInt(0,5);
	x=x+1;
	y=round(
        random(-100,100), 
        3
    ); #assigne à y un nombre réel entre -100 et 100, arrondi à 3 décimales
	z=3
	```
On peut ici voir que la ligne `y=round(random(-100,100), 3);` a été scindée grâce à l'absence de ';' précédant la fin des trois premières lignes.


L'instruction MathJax `\mjs{expression}` permet d'afficher le résultat d'une expression à l'aide des variables calculées dans les blocs `mathjs`:

```mathjs
reponse=x^5
```
> La réponse était $\mjs{reponse}$.
> En effet, $\mjs{x}^5 = \mjs{reponse}$


	```mathjs
	reponse=x^5
	```
    > La réponse était $\mjs{reponse}$.
    > En effet, $\mjs{x}^5 = \mjs{reponse}$

Note: Les variables sont interpolées séquentiellement, il est donc possible de les redéfinir entre deux affichages.

De la même manière, il est possible d'exécuter du JavaScript au sein d'un bloc MathJax avec l'instruction `js`. L'utilisation de cette commande est toutefois découragée car elle peut causer des comportements inattendus.

$$\js{new Date()}$$

	$$\js{new Date()}$$



Les graphes
-------

Ces zones de texte définissent des paramètres pour un graphe Plotly:

```plot
title=Comparaison des croissances de x et de sa racine carrée
min=-1
max=10
step=0.01
expr=["sqrt(x)","x"]
```

	```plot
    title=Comparaison des croissances de x et de sa racine carrée
	min=-1
	max=10
	step=0.01
	expr=["sqrt(x)","x"]
	```

Les questionnaires
----------
Un header ayant la classe `exercise` indique le début d'une question dans le cadre d'un questionnaire. Le titre est utilisé comme légende, le texte libre en dessous sera affiché normalement. 
Il est possible de terminer un bloc de question avant le header suivant en utilisant une barre horizontale (`---`)


### Questions à choix multiples
Les symboles `[ ]` en début de ligne généreront des réponses avec checkbox (plusieurs réponses possibles) tandis que les symboles `( )` généreront des réponses avec boutons radio (une seule réponse valide). Si le caractère du milieu est autre chose qu'un espace, la réponse sera considérée comme valide.
Une citation dans une réponse sera affichée lors de la correction. Si il s'agit d'une bonne réponse, elle sera affichée en vert, sinon elle sera affichée en rouge.

Les réponses possibles seront mélangées à chaque rechargement de la page. Seules les réponses adjacentes sont mélangées entre elles.

### Question 1{.exercise}
Est-il possible de caresser un léopard ?

- [ ] Oui

  > `Haha what`

- [ ] Non
  
  > En soit ce n'est pas faux

- [x] Kamoulox

  > *Seuls les connaisseurs sauront*

---

    ### Question 1{.exercise}
    Est-il possible de caresser un léopard ?
    
    - [ ] Oui
    
      > `Haha what`
    
    - [ ] Non
      
      > En soit ce n'est pas faux
    
    - [x] Kamoulox
    
      > *Seuls les connaisseurs sauront*
    
    ---

<br/>

Il est possible d'utiliser l'interpolation de variable pour créer des macros:

```mathjs
reponse1=round(sqrt(x) + sin(y), 3)
```

### Question 2{.exercise}
x vaut $\mjs{x}$ et y vaut $\mjs{y}$.<br/>
Combien vaut `x + y` ?<br/>

- ( ) $\mjs{reponse1}$

  > <br/> Mauvaise réponse !

- (+) $\mjs{x+y}$

  > Coucou

- <div>( ) Ne sait pas</div>

  > <br/> Mauvaise réponse !

<div id="correction" hidden>
Oops !

<div class="spoiler">
<h5>Indice</h5>

$$1+1=2$$

</div>
</div>


<script>
registerValidator("@current@", question => {
  if(question.answer_1.isChecked()) {
    question.answer_1.htmlElement.style.display = "none";
  }
  if(question.answer_3.isChecked()) {
    question.correction_3.view = "correction";
    question.correction_3.show();
  }});
</script>

---

~~~~~~~~~~~~~~
```mathjs
reponse1=round(sqrt(x) + sin(y), 3)
```

### Question 2{.exercise}
x vaut $\mjs{x}$ et y vaut $\mjs{y}$.<br/>
Combien vaut `x + y` ?<br/>

- ( ) $\mjs{reponse1}$

  > <br/> Mauvaise réponse !

- (+) $\mjs{x+y}$

  > Coucou

- <div>( ) Ne sait pas</div>

  > <br/> Mauvaise réponse !

<div id="correction" hidden>
Oops !

<div class="spoiler">
<h5>Indice</h5>

$$1+1=2$$

</div>
</div>


```correction
  if(question.answer_1.isChecked()) {
    question.answer_1.htmlElement.style.display = "none"; // Rend la première réponse invisible quand elle est cochée
  }
  if(question.answer_3.isChecked()) {
    question.correction_3.view = "correction"; // Affiche l'élément HTML ayant l'id "correction" quand la réponse 3 est cochée
    question.correction_3.show();
  }});
```

---
~~~~~~~~~~~~~~


```mathjs
reponse1 = 1;
reponse2 = 2;
```

### Question 3 {.exercise}
$\frac{(1 + 1)^2}{2} = ?$

- ( ) $\mjs{reponse1}$
- (+) $\mjs{reponse2}$
- ( ) Ne sait pas

---

~~~~~~~~~~~~~~
```mathjs
reponse1 = 1;
reponse2 = 2;
```

### Question 3 {.exercise}
$$\frac{(1 + 1)^2}{2} = ?$$

- ( ) $\mjs{reponse1}$
- (+) $\mjs{reponse2}$
- ( ) Ne sait pas
~~~~~~~~~~~~~~

```mathjs
n = randomInt(11,25);
k = randomInt(5,10);
reponse = (n!)/(k!*(n-k)!);
```


### Question 4 - Statistiques {.exercise}

a) Trouvez le ou les équivalents à l'expression suivante: 
$$\frac{\mjs{n}!}{\mjs{k}!(\mjs{n}-\mjs{k})!}$$

	- [x] $\binom{\mjs{n}}{\mjs{k}}$
	- [x] $\mjs{reponse}$
	- [ ] $e^{\frac{\mjs{-n}\times\pi}{\sqrt{\mjs{k}}}}$
	- [ ] $\log(\mjs{n}-\mjs{k})$

b) Que permet de faire un coefficient binomial ?

	- ( ) Connaître le nombre de combinaisons possibles de placement de $n$ convives autour d'une table
	- (+) Savoir combien de tirages de $k$ éléments parmi $n$ différents on peut réaliser

---

~~~~~~~~~~~~~~~
```mathjs
n = randomInt(11,25);
k = randomInt(5,10);
reponse = (n!)/(k!*(n-k)!);
```


### Question 4 - Statistiques {.exercise}

a) Trouvez le ou les équivalents à l'expression suivante: 
$$\frac{\mjs{n}!}{\mjs{k}!(\mjs{n}-\mjs{k})!}$$

	- [x] $\binom{\mjs{n}}{\mjs{k}}$
	- [x] $\mjs{reponse}$
	- [ ] $e^{\frac{\mjs{-n}\times\pi}{\sqrt{\mjs{k}}}}$
	- [ ] $\log(\mjs{n}-\mjs{k})$

b) Que permet de faire un coefficient binomial ?

	- ( ) Connaître le nombre de combinaisons possibles de placement de $n$ convives autour d'une table
	- (+) Savoir combien de tirages de $k$ éléments parmi $n$ différents on peut réaliser

---
~~~~~~~~~~~~~~~


### Questions avec fonctions
Un champ d'entrée ayant la classe `function_input` permet d'écrire des questions dont la réponse est une fonction mathématique.

La réponse n'aura pas besoin d'être strictement identique à la réponse officielle, toute formule équivalente sera acceptée.

### Question 5 {.exercise}
Que vaut le périmètre d'un carré de côté $x$ ?

  - <label for=question_5_answer_1 data-original="P(x)=">$P(x)=$</label><input type="text" class="function_input" name=" Question 5" id="question_5_answer_1" data-function="4x"/>

<div id="dinosaure" hidden>
<img height="42" width="42" src="https://pre00.deviantart.net/9532/th/pre/i/2015/106/2/d/denver_the_last_dinosaur_by_eligecos-d7ubr4p.png"/>
</div>

```correction
when question.answer_1.value {
  "x^2" : question.correction_1.show("Cette formule donne l'aire du carré.", false)
  "4x": question.correction_1.show("Exactement comme dans la correction.", true)
  "dinosaure" :
    question.correction_1.view = "dinosaure"
    question.correction_1.show()
}
```
---

Ici, les réponses `4x`, `x*4`, `4*x` et `x+x+x+x` sont toutes acceptées.
    
    ### Question 5 {.exercise}
    Que vaut le périmètre d'un carré de côté $x$ ?
    
      - <label for=question_5_answer_1 data-original="P(x)=">$P(x)=$</label><input type="text" class="function_input" name=" Question 5" id="question_5_answer_1" data-function="4x"/>
    
    <div id="dinosaure" hidden>
    <img height="42" width="42" src="https://pre00.deviantart.net/9532/th/pre/i/2015/106/2/d/denver_the_last_dinosaur_by_eligecos-d7ubr4p.png"/>
    </div>
    
    ```correction
    when question.answer_1.value {
      "x^2" : question.correction_1.color("red").show("Cette formule donne l'aire du carré.")
      "4x": question.correction_1.color("green").show("Exactement comme dans la correction.")
      "dinosaure" :
        question.correction_1.view = "dinosaure"
        question.correction_1.show()
    }
    ```
    ---

<br/>

### *Question 6* {.exercise}

a) Que vaut le périmètre d'un cercle de rayon $r$ ?
  - <label data-original="P(r)=">$P(r)=$</label><input type="text" class="function_input" name=" Question 6"data-function="PI*r*2"/>
b) Que vaut l'aire d'un disque de rayon $r$ ?
  - <label for=question_6_answer_2 data-original="P(r)=">$A(r)=$</label><input type="text" class="function_input" name=" Question 6" id="question_6_answer_2" data-function="PI*r^2"/>

---

~~~~~~~~~~~~~~~
### *Question 6* {.exercise}

a) Que vaut le périmètre d'un cercle de rayon $r$ ?
  - <label data-original="P(r)=">$P(r)=$</label><input class="function_input" name=" Question 6" data-function="PI*r*2"/>
b) Que vaut l'aire d'un disque de rayon $r$ ?
  - <label data-original="P(r)=">$A(r)=$</label><input class="function_input" name=" Question 6" data-function="PI*r^2"/>

---
~~~~~~~~~~~~~~~

