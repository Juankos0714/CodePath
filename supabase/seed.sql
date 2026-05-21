-- ============================================
-- SEED: Módulo 1 — Bienvenida al código
-- ============================================

-- Módulo
insert into modules (id, slug, title, description, icon, order_index, difficulty, estimated_minutes, is_published)
values (
  'a0000000-0000-0000-0000-000000000001',
  'bienvenida-al-codigo',
  'Bienvenida al código',
  'Tu primera aventura en el mundo de la programación. Aprende qué es el código, cómo piensa una computadora y escribe tu primer programa.',
  '👋',
  1,
  'beginner',
  30,
  true
);

-- ============================================
-- LECCIÓN 1: ¿Qué es programar?
-- ============================================
insert into lessons (id, module_id, slug, title, description, content_md, order_index, xp_reward, estimated_minutes, is_published)
values (
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'que-es-programar',
  '¿Qué es programar?',
  'Descubre qué es el código y por qué es una habilidad tan poderosa.',
  E'# ¿Qué es programar?\n\nProgramar es **darle instrucciones a una computadora** para que haga algo por ti.\n\nImagina que le explicas a un amigo cómo preparar un café:\n\n1. Agarra la taza\n2. Pon una cucharada de café\n3. Agrega agua caliente\n4. Revuelve\n\nUn programa funciona igual: es una lista de pasos que la computadora ejecuta exactamente como los escribes.\n\n## JavaScript: el lenguaje de la web\n\nJavaScript es el lenguaje que hace que las páginas web sean interactivas. Desde los botones de YouTube hasta las notificaciones de WhatsApp Web — todo eso está hecho con JavaScript.\n\n```javascript\n// Este es tu primer programa\nconsole.log("¡Hola, mundo!");\n```\n\nLa línea `console.log(...)` le dice a la computadora: *"muestra este texto"*.\n\n## ¿Por qué aprender a programar?\n\n- **Automatizar** tareas repetitivas (ahorra horas de trabajo)\n- **Crear** aplicaciones, sitios web, juegos\n- **Resolver problemas** de manera lógica y estructurada\n- **Conseguir empleos bien pagados** en la industria tech\n\n> 💡 No necesitas ser bueno en matemáticas. Necesitas ser bueno pensando paso a paso.',
  1,
  20,
  5,
  true
);

-- Ejercicios de la lección 1
insert into exercises (id, lesson_id, type, title, prompt, starter_code, solution_code, test_cases, hints, common_mistakes, difficulty, xp_reward, order_index)
values (
  'c0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'code_challenge',
  'Tu primer programa',
  'Usa `console.log()` para mostrar el texto **"¡Hola, CodePath!"** en la consola.',
  '// Escribe tu código aquí\n',
  'console.log("¡Hola, CodePath!");',
  '[{"input": null, "expected_output": "¡Hola, CodePath!", "description": "Debe mostrar el saludo exacto"}]',
  '["Usa console.log() con el texto entre comillas", "Las comillas pueden ser simples o dobles", "Verifica que el texto sea exactamente: ¡Hola, CodePath!"]',
  '["Olvidar las comillas alrededor del texto", "Escribir console.Log en lugar de console.log (la L debe ser minúscula)", "Olvidar el punto y coma al final"]',
  1,
  10,
  1
),
(
  'c0000000-0000-0000-0000-000000000002',
  'b0000000-0000-0000-0000-000000000001',
  'code_challenge',
  'Muestra tu nombre',
  'Muestra tu nombre en la consola. Reemplaza "Tu nombre" con tu nombre real.',
  '// Muestra tu nombre\nconsole.log("Tu nombre");\n',
  'console.log("Juan");',
  '[{"input": null, "expected_output": null, "description": "El código debe ejecutarse sin errores y mostrar un texto", "check_type": "no_error"}]',
  '["Solo cambia el texto dentro de las comillas", "Puede ser tu nombre, apodo o cualquier texto"]',
  '["Eliminar el console.log", "Dejar el texto vacío"]',
  1,
  10,
  2
);

-- ============================================
-- LECCIÓN 2: Variables y tipos
-- ============================================
insert into lessons (id, module_id, slug, title, description, content_md, order_index, xp_reward, estimated_minutes, is_published)
values (
  'b0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  'variables-y-tipos',
  'Variables y tipos de datos',
  'Aprende a guardar información en variables y conoce los tipos de datos básicos de JavaScript.',
  E'# Variables y tipos de datos\n\nUna **variable** es como una caja donde guardas información para usarla después.\n\n```javascript\nlet nombre = "María";\nlet edad = 25;\nlet esProgramadora = true;\n\nconsole.log(nombre);          // María\nconsole.log(edad);            // 25\nconsole.log(esProgramadora);  // true\n```\n\n## Las palabras clave: `let`, `const`, `var`\n\n| Palabra | Cuándo usarla |\n|---------|---------------|\n| `const` | El valor **nunca cambia** (la mayoría de los casos) |\n| `let` | El valor **puede cambiar** |\n| `var` | Antigua, **evítala** en código moderno |\n\n```javascript\nconst PI = 3.14159;    // Nunca cambiará\nlet puntos = 0;        // Irá aumentando\npoints = points + 10;  // OK, let permite cambios\n// PI = 3; ← ¡Error! const no permite cambios\n```\n\n## Los 5 tipos de datos básicos\n\n```javascript\n// 1. String (texto)\nconst mensaje = "Hola mundo";\n\n// 2. Number (número)\nconst precio = 99.99;\n\n// 3. Boolean (verdadero/falso)\nconst activo = true;\n\n// 4. null (vacío intencionalmente)\nconst resultado = null;\n\n// 5. undefined (no asignado)\nlet pendiente;\nconsole.log(pendiente); // undefined\n```\n\n## Interpolación de strings (template literals)\n\nPuedes insertar variables dentro de un texto usando backticks `` ` `` y `${}`:\n\n```javascript\nconst nombre = "Carlos";\nconst edad = 30;\n\nconsole.log(`Me llamo ${nombre} y tengo ${edad} años.`);\n// Me llamo Carlos y tengo 30 años.\n```\n\n> 💡 Prefiere `const` por defecto. Cambia a `let` solo cuando sepas que el valor va a cambiar.',
  2,
  25,
  7,
  true
);

-- Ejercicios de la lección 2 (la lección piloto end-to-end)
insert into exercises (id, lesson_id, type, title, prompt, starter_code, solution_code, test_cases, hints, common_mistakes, difficulty, xp_reward, order_index)
values (
  'c0000000-0000-0000-0000-000000000003',
  'b0000000-0000-0000-0000-000000000002',
  'code_challenge',
  'Crea tus primeras variables',
  'Crea una variable `nombre` con tu nombre, una variable `edad` con tu edad, y muéstralas en la consola usando template literals. El formato debe ser exactamente: `"Me llamo [nombre] y tengo [edad] años."`',
  'const nombre = "";\nconst edad = 0;\n\n// Muestra el mensaje con template literals\nconsole.log(/* tu código aquí */);\n',
  'const nombre = "María";\nconst edad = 25;\n\nconsole.log(`Me llamo ${nombre} y tengo ${edad} años.`);',
  '[{"input": null, "check_type": "pattern", "pattern": "Me llamo .+ y tengo \\\\d+ años\\\\.", "description": "Debe mostrar el formato correcto con nombre y edad"}]',
  '["Usa backticks (`) en lugar de comillas para el template literal", "Usa ${variable} para insertar variables en el texto", "Asegúrate que el formato sea exactamente: Me llamo X y tengo Y años."]',
  '["Usar comillas normales en lugar de backticks para el template literal", "Olvidar el $ antes de las llaves: ${}", "Confundir const con let"]',
  2,
  15,
  1
),
(
  'c0000000-0000-0000-0000-000000000004',
  'b0000000-0000-0000-0000-000000000002',
  'code_challenge',
  'Suma de variables',
  'Crea dos variables numéricas `a` y `b`, luego crea una tercera variable `suma` que sea la suma de ambas. Muestra el resultado con `console.log(suma)`.',
  'const a = 15;\nconst b = 27;\n\n// Crea la variable suma y muéstrala\n',
  'const a = 15;\nconst b = 27;\nconst suma = a + b;\nconsole.log(suma);',
  '[{"input": null, "expected_output": "42", "description": "Debe mostrar 42 (15 + 27)"}]',
  '["La suma es a + b", "Usa const para la variable suma ya que no cambia después de crearse"]',
  '["Usar var en lugar de const", "Hacer la suma directamente en console.log sin guardarla en una variable (aunque también funcionaría)", "Escribir el resultado literal 42 sin hacer la suma de variables"]',
  1,
  15,
  2
),
(
  'c0000000-0000-0000-0000-000000000005',
  'b0000000-0000-0000-0000-000000000002',
  'code_challenge',
  'Tipos de datos',
  'Crea 3 variables: `ciudad` (string con el nombre de una ciudad), `poblacion` (number con la población en millones como decimal), y `esCapital` (boolean). Usa `console.log(typeof ciudad, typeof poblacion, typeof esCapital)` para verificar sus tipos.',
  '// Crea las 3 variables\n\n// Verifica sus tipos\nconsole.log(typeof ciudad, typeof poblacion, typeof esCapital);\n',
  'const ciudad = "Bogotá";\nconst poblacion = 7.4;\nconst esCapital = true;\nconsole.log(typeof ciudad, typeof poblacion, typeof esCapital);',
  '[{"input": null, "expected_output": "string number boolean", "description": "Debe mostrar los tres tipos de datos separados por espacios"}]',
  '["typeof devuelve el tipo como string", "Los booleans son true o false (sin comillas)", "Los números decimales usan punto, no coma"]',
  '["Poner el boolean entre comillas (quedaría string, no boolean)", "Usar coma en los decimales en lugar de punto", "Olvidar declarar alguna de las variables"]',
  2,
  15,
  3
);

-- ============================================
-- LECCIÓN 3: Interacción básica
-- ============================================
insert into lessons (id, module_id, slug, title, description, content_md, order_index, xp_reward, estimated_minutes, is_published)
values (
  'b0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000001',
  'interaccion-basica',
  'Interacción básica',
  'Aprende a trabajar con comentarios, operaciones básicas y a estructurar tu código.',
  E'# Interacción básica\n\nYa sabes declarar variables y mostrar información. Ahora vamos a explorar algunas operaciones fundamentales.\n\n## Comentarios\n\nLos comentarios son notas para humanos — la computadora los ignora:\n\n```javascript\n// Esto es un comentario de una línea\n\n/*\n  Esto es un comentario\n  de múltiples líneas\n*/\n\nconst pi = 3.14; // también puedes comentar al final de una línea\n```\n\n> 💡 Escribe código que se explique solo con nombres descriptivos. Los comentarios son para el "por qué", no el "qué".\n\n## Operaciones matemáticas\n\n```javascript\nconsole.log(10 + 3);  // 13 (suma)\nconsole.log(10 - 3);  // 7  (resta)\nconsole.log(10 * 3);  // 30 (multiplicación)\nconsole.log(10 / 3);  // 3.333... (división)\nconsole.log(10 % 3);  // 1  (módulo: el residuo)\nconsole.log(2 ** 8);  // 256 (potencia)\n```\n\n## Operaciones con strings\n\n```javascript\nconst saludo = "Hola";\nconst nombre = "mundo";\n\n// Concatenación con +\nconsole.log(saludo + " " + nombre); // Hola mundo\n\n// Longitud de un string\nconsole.log(saludo.length); // 4\n\n// Mayúsculas y minúsculas\nconsole.log(saludo.toUpperCase()); // HOLA\nconsole.log(saludo.toLowerCase()); // hola\n```',
  3,
  20,
  6,
  true
);

insert into exercises (id, lesson_id, type, title, prompt, starter_code, solution_code, test_cases, hints, common_mistakes, difficulty, xp_reward, order_index)
values (
  'c0000000-0000-0000-0000-000000000006',
  'b0000000-0000-0000-0000-000000000003',
  'code_challenge',
  'Calculadora básica',
  'Dados dos números, calcula y muestra en consola: su suma, resta, multiplicación y división. Cada resultado en una línea separada.',
  'const x = 20;\nconst y = 4;\n\n// Muestra suma, resta, multiplicación y división\n',
  'const x = 20;\nconst y = 4;\nconsole.log(x + y);\nconsole.log(x - y);\nconsole.log(x * y);\nconsole.log(x / y);',
  '[{"input": null, "expected_output": "24\n16\n80\n5", "description": "Debe mostrar los 4 resultados, uno por línea"}]',
  '["Cada console.log genera una nueva línea", "Los operadores son: + - * /"]',
  '["Usar coma entre operaciones en un solo console.log (no genera líneas separadas)", "Poner los números directamente en vez de usar las variables x e y"]',
  1,
  10,
  1
);
