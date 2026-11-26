# Protocole de revue

Partagé par les reviewers de stack (agents `*-reviewer`) et les revues de code. Additif : chaque reviewer garde sa grille sur 100 points et son format de rapport.

1. **Lire au-delà du diff.** Pour chaque fonction, champ, route, événement ou export modifié, chercher avec Grep ses appelants et ses imports, et les lire. Un renommage ou une valeur de retour modifiée casse le plus souvent un fichier que le diff ne montre pas.
2. **Vérifier, dans cet ordre :** bugs et appelants cassés ; sécurité (règle 11) ; comportement sous charge réelle (requêtes N+1, boucles ou listes non bornées, pagination absente, timeouts) ; logique à risque sans test (règle 07) ; chemins lents ; code inutile (règle 24).
3. **Rédiger chaque constat ainsi :** emplacement (`fichier:ligne`) · ce que fait le code · ce qui ne va pas (une entrée concrète et le mauvais résultat) · le correctif · le risque si on l'ignore.
4. **Classer :** *À corriger* (résultat faux, crash, perte de données, faille) · *À envisager* · *Optionnel*. Lister d'abord les *À corriger*, et écrire « aucun » s'il n'y en a pas.
5. **Ignorer** ce que les linters et formateurs imposent déjà.
