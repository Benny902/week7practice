# REFLECTION.MD

## Learned:
We learned how to create a full CI/CD pipeline using GitHub Actions, including build, lint, test, artifact upload, and notifications. We used matrix builds to test across multiple Node.js versions and added caching for faster installs.

## Challenges:
The main challenge was restricting deployment to only run on pushes to main or manual triggers.  
We also had to manage step ordering and handle conditional logic within matrix jobs.

### we solved the deploy restriction by:  
 `github.event_name == 'workflow_dispatch' || (github.event_name == 'push' && github.ref == 'refs/heads/main')`  
 which means it will only activate those deploys if its push in main, or clicked manually in the github actions (workflow_dispatch)

### we solved the matrix issue by:  
 ```yaml
          if [ "${{ matrix.node-version }}" < "18" ] ; then
            npm install
          else
            npm ci
          fi
 ```
which means if the node is under 18 it will use `npm install` and if its 18 or higher it will use `npm ci`

- npm install installs dependencies listed in package.json, and may update package-lock.json.
- npm ci strictly installs from package-lock.json, is faster, and ensures a clean, reproducible install — ideal for CI pipelines.

## Improvements:
For a production pipeline, we would add test coverage checks, separate deploys for staging and production, and include security scans. Reusable workflows would also help reduce duplication and improve maintainability.
