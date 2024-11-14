pipeline {
    agent any

    environment {
        NODEJS_HOME = tool name: 'NodeJS'
        PATH = "${NODEJS_HOME}/bin:${env.PATH}"
        SONARQUBE_SERVER = 'SonarQube'
        GITHUB_CREDENTIALS_ID = 'github-pat'
        NEXUS_URL = 'http://10.0.0.129:8081'
        NEXUS_REPO = 'node-app-repo'
        NEXUS_CREDENTIALS_ID = 'nexus'
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Pull the latest code from the GitHub repository
                git branch: 'main', credentialsId: "${GITHUB_CREDENTIALS_ID}", url: 'https://github.com/scarlet2131/NodeAppCICD.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install all required Node.js dependencies
                sh 'npm install'
            }
        }

        stage('Build with Webpack') {
            steps {
                // Run Webpack to bundle the application
                sh 'npx webpack'
            }
        }

        stage('Test') {
            steps {
                script {
                    try {
                        sh 'npm test'
                    } catch (Exception e) {
                        error "Tests failed!"
                    }
                }
            }
        }
        

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    script {
                        def scannerHome = tool 'SonarScanner' // Ensure this matches the name you configured
                        sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=my-nodejs-project"
                    }
                }
            }
        }


        stage('Quality Gate') {
            steps {
                script {
                    // Wait for SonarQube's quality gate status
                    timeout(time: 1, unit: 'MINUTES') {
                        waitForQualityGate abortPipeline: true
                    }
                }
            }
        }
        

        stage('Package Artifact') {
            steps {
                // Package the application into a zip file
                sh 'zip -r node-app.zip dist/ public/ package.json package-lock.json'
            }
        }

        stage('Deploy to Nexus') {
            steps {
                // Upload the package to Nexus repository
                // nexusArtifactUploader(
                //     nexusVersion: 'nexus3',
                //     protocol: 'http',
                //     nexusUrl: "${NEXUS_URL}",
                //     repository: "${NEXUS_REPO}",
                //     credentialsId: "${NEXUS_CREDENTIALS_ID}",
                //     artifacts: [
                //         [
                //             artifactId: 'node-app',
                //             groupId: 'com.github.scarlet2131',
                //             version: '1.0.0',                 // Version of the artifact
                //             classifier: '',
                //             file: 'node-app.zip',
                //             type: 'zip'
                //         ]
                //     ]
                // )

                nexusArtifactUploader artifacts: [[artifactId: 'node-app', classifier: '', file: 'node-app.zip', type: 'zip']], credentialsId: 'nexus', groupId: 'com.github.scarlet2131', nexusUrl: '10.0.0.129:8081', nexusVersion: 'nexus3', protocol: 'http', repository: 'node-app-repo', version: '1.0.0'            }
        }

        stage('Install PM2') {
            steps {
                sh 'npm install -g pm2'
            }
        }

        stage('Check PATH') {
            steps {
                sh 'echo $PATH'
                sh 'which pm2'
            }
        }



        stage('Deploy Application') {
            steps {
                // Use PM2 to stop the old version and start the new one
                sh 'pm2 stop node-app || true'
                sh 'pm2 start dist/bundle.js --name node-app --watch'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
