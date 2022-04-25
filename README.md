<div align="center">
<a href="https://chronorule.app">
	<img alt="Chronorule" src="/images/logo_light-dark-dynamic.svg" width="100%" height="60px"></img>
</a>
<h3>
	<a href="https://chronorule.app">Editor</a>
	<span> · </span>
	<a href="https://github.com/Chronorule/Chronorule">Source</a>
</h3>
</div>

## About

### Description

The Chronorule editor is a web app for creating, editing, and publishing interactive timelines.

### Usage

Visit the live [web app](https://chronorule.app), or download the 
repository and open the `index.html` file to use the application.

<br/>

## Development

### Contributing

The project is setup to be as low-friction as possible for anyone to contribute code or other resources, making Chronorule a great project for beginners to learn about web technolgies or for experienced pros to make quick changes. Here's everything you need to know to start contributing:

 - The project is developed natively in HTML, JS, and SCSS.
 - Markup is contained within `index.html`.
 - Stylesheets are organized across multiple files in `scss/`.
   - Download "[Dart Sass](https://github.com/sass/dart-sass/releases/latest)" to compile and bundle SCSS.
   - [Add the program to your "path"](#a1) for easy access from the command line.
   - When editing stylesheets; open a command line, navigate to the project's main folder, and run the following command:<br>
     `sass --watch --style=compressed scss:dist`
 - Scripts are organized across multiple files in `js/`.
   - When editing scripts; open a command line, navigate to the project's main folder, and run the following command:<br>
     `./dev/Watch-Concat-File-Lists -InFolder js -OutFolder dist`
   - Download "[esbuild](https://esbuild.github.io/getting-started/#download-a-build)" to minify JS.
   - [Add the program to your "path"](#a1) for easy access from the command line.
   - When editing scripts (or when finished, omitting the `--watch` flag); open a command line, navigate to the project's main folder, and run the following command:<br>
     `esbuild dist/editor.js --outfile=dist/editor.js --watch --minify --allow-overwrite`
  - Assuming you have the necessary programs in your "path", you can simply run `develop.ps1` to perform
    all the steps above. If not running on Windows, you must install [PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/overview) for [Mac](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-macos) or [Linux](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-linux) to run the included scripts.

#### Q/A

<details>
<summary>Q1: How do I add a program to my "path"?</summary>
	<p><blockquote>
	<h4>A1:</h4>
	The "path" is a historical concept present in many modern operating systems. It refers to a particular <i>environment variable</i>, which is a system-wide variable that is accessible in the command-line interface. The "path" variable in particular stores a list of file paths to executable command-line programs. When present in the "path", these programs are accessible from the command-line interface using the program name rather than the program's full file path. To add a program to your "path", follow the operating-system-specific instructions below.
	<p>
	<details>
	<summary>Windows</summary>
		<p>
		<ol>
			<li>In the Windows menu or search bar, search "environment".</li>
			<li>Select "Edit environment variables for your account".</li>
			<li>Under "User variables for ...", find "Path" and select it.</li>
			<li>Click "Edit" and then "New".</li>
			<li>Enter the full path of the folder containing the program(s) you wish to add. Click OK.</li>
		</ol>
		<p>
	</details>
	<details>
	<summary>Mac</summary>
		<p>
		<ol>
			<li>Navigate to your <i>user home folder</i> (<code>/~</code>).</li>
			<li>If it does not exist already, create a file called <code>.bash_profile</code></li>
			<li>In the `.bash_profile` file, add a line with the following:<br>
				<code>export PATH="/path/to/folder/containing/the/program:$PATH"</code></li>
		</ol>
		<p>
	</details>
	<details>
	<summary>Linux</summary>
		<p>
		<blockquote>Linux has several <i>shells</i> that may be used within the <i>command-line interface</i>. "Bash" is the most common shell. If you know you are using bash, then you may do the following:</blockquote>
		<ol>
			<li>Navigate to your <i>user home folder</i> (<code>/~</code>).</li>
			<li>If it does not exist already, create a file called <code>.bashrc</code></li>
			<li>In the `.bash_profile` file, add a line with the following:<br>
				<code>export PATH="/path/to/folder/containing/the/program:$PATH"</code></li>
		</ol>
		<p>
	</details>
	</p>
	<a href="https://en.wikipedia.org/wiki/PATH_(variable))">More information</a>
	</blockquote><p>
</details>

<details>
<summary>Q2: What is "SCSS"?</summary>
	<p><blockquote>
	<h4>A2:</h4>
	<p>SCSS is a superset of CSS, the stylesheet language used in web documents. That is, all valid CSS is valid SCSS. SCSS, as implemented in the "Dart Sass" compiler, provides a simple set of organizational and reusability tools on top of CSS, such as nesting, mixins, and file bundling. "Sass" is essentially SCSS without brackets, and online resources may refer to both the SCSS and Sass languages collectively as "Sass".</p>
	<a href="https://sass-lang.com/documentation">More information</a>
	</blockquote></p>
</details>

### Roadmap

Below is an outline of the major user-centric features remaining to be added.

Planned:
- Publish timelines from the app (expose the generated code for embedding)
- Display ranged events (create visuals for the existing data and data inputs)
- Update the display of events to display multiple group colors
- Usability fixes

Potential Future Additions:
- "Fuzzy" event times
- Nested groups
- Redesigned timeline visuals with external feedback or designs
- Numerous quality-of-life improvements

Not Planned (Open to Contributors):
- Mix-and-match calendars (currently only Gregorian)
- Customizable editor for different projects (customize spreadsheet headings)
- Customizable timeline layout and controls (beyond styling)
- More publishing options (images, PowerPoint)
- Advanced: Emit JavaScript events
