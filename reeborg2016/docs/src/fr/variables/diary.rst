Le journal de Reeborg
=====================

.. index:: print(), argument de fonction

Exécutez le programme suivant::

    print()

Vous devriz voir une fenêtre flottante vide apparaître dont
le titre est **Reeborg écrit:**.
Cette fenêtre flottante est le journal de Reeborg.
Sentez-vous libre de la déplacer ailleurs sur l'écran.

.. note::

    **Important:** l'exemple à droite n'exécute pas la fonction ``avance``;
    par contre, si nous faisons::

        print( avance() )

    de telle sorte que ``avance`` soit exécutée, ``None``, un mot-clé Python,
    sera écrit dans le journal de Reeborg.  Nous expliquerons plus tard la
    raison pour ceci.

Exécutez maintenant le programme qui suit::

    print(avance)

Au moment où je **corrige** ce tutoriel, le résultat est le suivant::

    <function avance>

Précédemment, le résultat était ``<function _move_>``.  Vous serez
probablement en mesure de deviner pourquoi sous peu.

Le mot anglais ``function`` signifie *fonction*; le mot ``move`` est un mot
anglais qui est habituellement traduit par *bouge* mais qui peut également
signifier *avance*.

Qu'arriverait-il si on définissait un autre nom (une variable) pour désigner
la même fonction?

.. code-block:: py3

    marche = avance
    print(avance)
    print(marche)

Le résultat est::

    <function avance>
    <function avance>

On voit bien ici que ``=`` sert simplement à donner un autre nom à un
objet; l'objet lui-même, ce que Python désigne par ``<function avance>`` ici,
ne change pas.

Par contre, si on définit une autre fonction, comme par exemple::

    # marche = avance

    def marche():
        avance

    print(marche)

le résultat sera::

    <function marche>

qui est un objet différent de ``<function avance>``;
cependant, ``marche()`` et ``avance()`` auront le même résultat si on
les invoque.


Une fonction peut avoir un argument
-----------------------------------

En informatique, le mot **argument** réfère à une variable
qui détermine le résultat d'une fonction.  Par exemple,
pour le programme ci-dessus::

    print(avance)

la variable ``avance`` est l'argument de la fonction ``print``.
L'argument d'une fonction apparait entre les parenthèses qui
indiquent qu'on veut que la fonction soit exécutée.

Écrire des textes
-----------------

Écrire le nom d'une fonction comme on l'a fait ci-dessus en
invoquant la fonction ``print``
est quelque chose qu'on fait très, très, **très** rarement
en programmation.  La plupart du temps, si on écrit
quelque chose, c'est plutôt du texte.


Dans le jargon de la programmation, un *caractère* est n'importe quelle
lettre, chiffre ou symbole qui peut être imprimé, et une *chaîne de
caractères*, ou plus simplement une *chaîne*, est n'importe quelle
combinaison de caractères pouvant être imprimés. Par exemple, exécutez
les instructions suivantes::


    print("Bonjour monde!")
    print('Bonjour encore.')

Notez que les guillemets **anglais** qui encadrent la *chaîne* doivent
être semblables, soient doubles, ", ou simples, ", doivent être les
mêmes; à noter que ce ne sont **pas** des guillemets français « ». Si
vous voulez inclure un guillemet dans une chaîne, vous pouvez soit
utiliser des guillemets d'un type différent pour encadrer la chaîne, ou
les précéder du *caractère d'échappement* ``\``.

.. index:: \', \", \n, charactère d'échappement, séquence d'échappement

.. code:: py3

    print("Ajourd'hui.")
    print('Aujourd\'hui.')

On peut combiner les chaînes en utilisant le symbole d'addition ``+``::

    print("Au revoir! " + "Et merci pour tout.")

Vous pouvez également débuter une nouvelle ligne en utilisant la
*séquence d'échappement* ``\n``::


    print("Merci. \nEssayez encore")

.. topic:: Vérifiez par vous-mêmes

    Assurez-vous de vérifier que vous comprenez bien le tout en
    reproduisant les exemples de programmes ci-dessus pour écrire
    des textes simples.


Reeborg connaît les maths
-------------------------

Exécutez le programme suivant et observez le résultat dans le journal de
Reeborg.

.. index:: +, *, -, /, //

.. topic:: Faites des maths!

    Essayez les exemples suivants::

        print( 2 + 3 )  # addition
        print( 2 * 3 )  # multiplication
        print( 3 - 2 )  # soustraction
        print( 6 / 2 )  # division
        print( 1 + 3 * 2 ) # multiplication avant addition

        # Mais, les parenthèses permettent de changer l'ordre des opérations
        print( (1 + 3) * 2 )

        print( 2 ** 5 ) # puissance ... 2**5 = 2 * 2 * 2 * 2* 2


.. note::

    Notez que les espaces autour des opérateurs comme ``+`` et ``*``,
    sont ignorés par Python; cependant, ils peuvent faciliter la lecture
    (et la compréhension) pour les humains.

Dans les exemples ci-dessus, le résultat était toujours un nombre
entier **sauf** pour la division qui donnait un nombre décimal:
``6 / 2`` donne ``3.0``.   Python suit la convention anglaise et
utilise un point au lieu d'une virgule pour séparer la partie
entière de la partie décimale.

Si on veut que le résultat de la division soit un nombre entier,
on utilisera plutôt un double symbole de division::

    print( 6 // 2 )  # division entière


Utilisation des variables
-------------------------

Nous avons déjà vu l'idée d'utiliser différents noms (synonymes) pour le
même concept. Utilisons-le à nouveau dans un
contexte mathématique.

.. code:: py3

    longueur = 4
    largeur = 6
    aire = longueur * largeur
    print(aire)  # imprimera 24

.. topic:: À votre tour!

    Reproduisez l'exemple ci-dessus, puis inventez vos propres exemples.


.. warning::

    Le *caractère* "2" n'est pas le même objet que le *chiffre* 2.
    Essayez ce qui suit::

        print("2" + 2)

Arguments multiples
-------------------

Certaines fonctions, dont ``print()`` peuvent accepter plusieurs
arguments; les différents arguments sont séparés par des virgules.
Pour démontrer ceci, nous pouvons faire une légère modification
au programme démontrant le calcul de l'aire d'un rectangle::

    longueur = 4
    largeur = 6
    aire = longueur * largeur
    print("L'aire du rectangle de longueur", longueur,
          "et de largeur", largeur, "est", aire)
