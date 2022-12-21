Collection de jetons
====================

Certains aiment collectionner les timbres, d'autres collectionnent les
pièces de monnaie; Reeborg, lui, aime collectionner les jetons. Il
utilise son imagination pour représenter toute sorte d'objet par des
jetons. Il peut les ramasser lorsqu'ils sont par terre, ou les déposer,
en utilisant les instructions suivantes::

    prend()
    depose()

Sélectionnez le monde **Jetons 1**. Il y a un jeton tout juste à côté de
Reeborg avec un chiffre 1 en rouge à côté: le chiffre 1 indique qu'il
n'y a qu'un seul jeton à cet endroit; la couleur rouge indique que
le jeton n'est pas à l'endroit désiré.
Dans le carré suivant, on voit une image d'une jeton en ton de gris plutôt
qu'en couleur: ceci indique que Reeborg doit
déposer un seul jeton à cet endroit. Finalement, le carré suivant
en vert pale indique l'endroit où Reeborg doit terminer son programme.

.. topic:: À votre tour!

    Écrivez un programme pour accomplir cette tâche. Est-ce que
    votre programme peut également, sans aucun changement, accomplir la
    tâche du monde **Jetons 2**? La réponse devrait être non ... mais, plus
    tard, vous apprendrez à écrire un seul programme pouvant accomplir ces
    deux tâches.




.. topic:: Essayez autre chose!

    Qu'arrive-t-il si Reeborg essaie de déposer un jeton alors qu'il n'en a
    pas avec lui? Qu'arrive-t-il s'il essaie d'en ramasser un là où il n'y
    en a pas?


.. admonition:: Pour les enseignants

    Pour les premières tâches présentées aux étudiants, les mondes ont
    été conçus de façon à ce qu'il n'y ait qu'un seul type d'objet.
    Pour les mondes ayant plus d'un type d'objets, il faut parfois
    utiliser des arguments de fonctions tels que::

        prend("jeton")
        depose('jeton')

    Dans ce tutoriel, la discussion des arguments des fonctions est
    reportée à plus tard.
