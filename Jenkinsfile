pipeline {
    agent any

    environment {
        NODEJS_HOME = tool name: 'NodeJS'
        PATH = "${NODEJS_HOME}/bin:${env.PATH}"
        SONARQUBE_SERVER = 'SonarQube'
        GITHUB_CREDENTIALS_ID = 'github-credentials'
        NEXUS_URL = 'http://localhost:8081'
        NEXUS_REPO = 'node-app-repo'
        NEXUS_CREDENTIALS_ID = 'nexus-credentials'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git credentialsId: "${GITHUB_CREDENTIALS_ID}", url: 'https://github.com/scarlet2131/NodeAppCICD.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner -Dsonar.projectKey=my-nodejs-project'
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    timeout(time: 1, unit: 'MINUTES') {
                        waitForQualityGate abortPipeline: true
                    }
                }
            }
        }

        stage('Package Artifact') {
            steps {
                sh 'zip -r node-app.zip dist/'
            }
        }

        stage('Deploy to Nexus') {
            steps {
                nexusArtifactUploader(
                    nexusVersion: 'nexus3',
                    protocol: 'http',
                    nexusUrl: "${NEXUS_URL}",
                    repository: "${NEXUS_REPO}",
                    credentialsId: "${NEXUS_CREDENTIALS_ID}",
                    artifacts: [
                        [artifactId: 'node-app', classifier: '', file: 'node-app.zip', type: 'zip']
                    ],
                    groupId: 'com.example',
                    version: '1.0.0'
                )
            }
        }

        stage('Deploy Application') {
            steps {
                sh 'pm2 stop node-app || true'
                sh 'pm2 start dist/server.js --name node-app --watch'
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
