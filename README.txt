bower_components is the static file

it is created inside the Penquality project by doing:

$ bower init

? name Penquality
? description phd project
? main file
? what types of modules does this package expose? amd, es6, globals, node, yui
? keywords phd project
? authors Monica <monica.noselli@gmail.com>
? license MIT
? homepage https://www.engineering.leeds.ac.uk/people/computing/student/scmno
? set currently installed components as dependencies? Yes
? add commonly ignored files to ignore list? Yes
? would you like to mark this package as private which prevents it from being accidentally published to the registry? Yes

{
  name: 'Penquality',
  authors: [
    'Monica <monica.noselli@gmail.com>'
  ],
  description: 'phd project',
  main: '',
  moduleType: [
    'amd',
    'es6',
    'globals',
    'node',
    'yui'
  ],
  keywords: [
    'phd',
    'project'
  ],
  license: 'MIT',
  homepage: 'https://www.engineering.leeds.ac.uk/people/computing/student/scmno',
  private: true,
  ignore: [
    '**/.*',
    'node_modules',
    'bower_components',
    'test',
    'tests'
  ]
}


$ bower install angular-nvd3 --save



///
to check django version
terminal$ python -c "import django; print(django.get_version())"



//https://github.com/angular-ui/bootstrap
//https://angular-ui.github.io/bootstrap/
$ bower install angular-bootstrap --save
bower angular-bootstrap#*       cached git://github.com/angular-ui/bootstrap-bower.git#1.1.2
bower angular-bootstrap#*     validate 1.1.2 against git://github.com/angular-ui/bootstrap-bower.git#*
bower angular-bootstrap#^1.1.2 install angular-bootstrap#1.1.2

angular-bootstrap#1.1.2 bower_components/angular-bootstrap
└── angular#1.5.0
